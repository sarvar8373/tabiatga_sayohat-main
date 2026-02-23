import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/host/host";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Redux hooklar
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { getUserDetails, postLogin } from "../../service/usersApi";
import { authStart, authSuccess, authFailure } from "../../slice/auth"; // Auth slice-dan

export default function AdventureModal({ adventure, showModal, handleClose }) {
  const [phone_number, setPhone_number] = useState("");
  const [full_name, setFull_name] = useState("");
  const [password, setPassword] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [step, setStep] = useState(1);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux-dan yuklanish va xatolik holatlarini olamiz
  const { isLoading, error: reduxError } = useSelector((state) => state.auth);

  const handlePhoneNumberCheck = async () => {
    dispatch(authStart());
    setLocalError("");
    try {
      const response = await axios.post(`${BASE_URL}/auth/check-phone`, {
        phone_number,
      });
      setIsExistingUser(response.data.exists);
      setStep(2);
      // Bu yerda authSuccess emas, shunchaki startni tugatish yoki holatni yangilash mumkin
      // Lekin bizga faqat yuklanishni to'xtatish kerak
      dispatch(authFailure(null));
    } catch (err) {
      setLocalError("Telefon raqamini tekshirishda xatolik.");
      dispatch(authFailure("Check failed"));
    }
  };

  const handleOrder = async () => {
    dispatch(authStart());
    setLocalError("");
    try {
      // 1. Yangi foydalanuvchi bo'lsa ro'yxatdan o'tkazish
      if (!isExistingUser) {
        await axios.post(`${BASE_URL}/auth/add_user`, {
          phone_number,
          full_name,
          password,
        });
      }

      // 2. Login qilish
      const loginResponse = await postLogin({
        phone_number: phone_number,
        password: password,
      });

      if (loginResponse.data && loginResponse.data.token) {
        const token = loginResponse.data.token;

        // Redux-ga foydalanuvchi ma'lumotlarini saqlaymiz (ichida setItem("token") bor)
        dispatch(authSuccess(loginResponse.data));

        // 3. Foydalanuvchi ID sini olish
        const userResponse = await getUserDetails();
        const userId = userResponse.data.id;

        if (!userId) throw new Error("User ID topilmadi");

        // 4. Buyurtma berish
        const orderResponse = await axios.post(`${BASE_URL}/orders/add_order`, {
          user_id: userId,
          tour_id: adventure.id,
          quantity: 1,
          total_price: adventure.price,
          status: "pending",
        });

        if (orderResponse.status === 200) {
          handleClose();
          navigate("/dashboard");
        }
      } else {
        setLocalError("Tizimga kirishda xatolik.");
        dispatch(authFailure("Login failed"));
      }
    } catch (err) {
      const msg = err.response?.data?.Error || "Xatolik yuz berdi";
      setLocalError(msg);
      dispatch(authFailure(msg));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      handlePhoneNumberCheck();
    } else {
      handleOrder();
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 1
            ? "Raqamingizni kiriting"
            : isExistingUser
              ? "Login"
              : "Akkaunt ochish"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {step === 1 && (
            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                placeholder="+998"
                pattern="[+]{1}[9]{1}[9]{1}[8]{1}[0-9]{9}"
                onChange={(e) => setPhone_number(e.target.value)}
                required
              />
            </Form.Group>
          )}
          {step === 2 && (
            <>
              {!isExistingUser && (
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="FIO *"
                    onChange={(e) => setFull_name(e.target.value)}
                    required
                  />
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Parol"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </>
          )}

          {(localError || reduxError) && (
            <p className="text-danger">{localError || reduxError}</p>
          )}

          <Modal.Footer>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : step === 1 ? (
                "Keyingisi"
              ) : (
                "Bron qilish"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
