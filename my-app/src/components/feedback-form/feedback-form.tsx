import React, {useState} from "react";
import ReactInputMask from 'react-input-mask';

interface FormState {
    phoneNumber: string;
    name: string;
    message: string;
}

export const FeedbackModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formStatus,setFormStatus] = useState('')
    const [formState, setFormState] = useState({
        phone: "",
        name: "",
        message: "",
        phoneError: "",
        nameError: "",
        messageError: "",
        formError: "",
        formSuccess: "",
    });
    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };
    const formatPhoneNumber = (phoneNumber: string) => {
        console.log(phoneNumber)
        phoneNumber = phoneNumber.replace(/\D/g, "");
        // добавляем +7 и разделители

        const newPhoneValue = `+7 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 8)}-${phoneNumber.slice(8, 10)}`;
        return newPhoneValue;
        // const cleaned = phoneNumber.replace(/\D/g, '');
        // const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
        //
        // if (match) {
        //     return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
        // }
        // return phoneNumber;
    };
    const validatePhoneNumber = () => {
        const { phone }= formState;
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 11;

    };
    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState((prevState) => ({
            ...prevState,
            phone: event.target.value,
        }));
    };
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        let nameError = "";

        // Проверяем, что имя не содержит спецсимволы
        if (!/^[a-zA-Zа-яА-Я\s]+$/.test(name)) {
            nameError = "Имя не должно содержать специальных символов";
        }
        // Обновляем состояние
        setFormState((prevState) => ({
            ...prevState,
            name,
            nameError,
        }));
    };
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const message = e.target.value;
        let messageError = "";

        // Проверяем, что сообщение не содержит спецсимволы
        if (!/^[a-zA-Zа-яА-Я\d\s.,?!:;()\-_"'’]+$/.test(message)) {
            messageError = "Сообщение не должно содержать специальных символов";
        }

        // Обновляем состояние
        setFormState((prevState) => ({
            ...prevState,
            message,
            messageError,
        }));
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { phone, name, message } = formState;
        if (!validatePhoneNumber() || !name || !message) {
            setFormStatus('error');
            return;
        }
        const data = {
            phone: phone.replace(/\D/g, ''),
            name,
            message,
        };
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                setFormStatus('success');
                const blob = await response.blob();
                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = 'feedback.json';
                link.click();
            } else {
                setFormStatus('error');
            }
        } catch (error) {
            console.error(error);
            setFormStatus('error');
        }
    };
    const renderFormStatus = () => {
        if (formStatus === 'success') {
            return <p>Форма отправлена успешно!</p>;
        }
        if (formStatus === 'error') {
            return <p>Произошла ошибка при отправке формы.</p>;
        }
        return null;
    };



    return (
        <>
            <button className={'modal-button-open'} onClick={handleOpenModal}>Открыть форму обратной связи</button>
            {isOpen && (
                <div className="modal">
                    <div className="modal__content">
                        <h2>Форма обратной связи</h2>
                        {renderFormStatus()}
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="phoneNumber">Номер телефона</label>
                            <ReactInputMask
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formState.phone}
                                onChange={handlePhoneNumberChange}
                                mask="+7 (999) 999-99-99"
                            />
                            <label htmlFor="name">Имя</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formState.name}
                                onChange={handleNameChange}
                            />
                            <label htmlFor="message">Сообщение</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formState.message}
                                onChange={handleMessageChange}
                            />
                            <button type="submit">Отправить</button>
                        </form>
                        <button onClick={handleCloseModal}>Закрыть</button>
                    </div>
                </div>
            )}
        </>
    );
};