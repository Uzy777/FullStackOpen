import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

const Notification = () => {
    const notification = useSelector((state) => state.notification);

    if (!notification.message) {
        return null;
    }

    // return <div className={notification.type}>{notification.message}</div>;
    return <Alert variant="success">{notification.message}</Alert>;
};

export default Notification;
