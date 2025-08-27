import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './toast-notification.css';

const ToastNotification = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose();
            }, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={classNames(
                styles.toast,
                styles[`toast${type.charAt(0).toUpperCase() + type.slice(1)}`],
                { [styles.toastVisible]: isVisible }
            )}
        >
            <div className={styles.toastContent}>
                <span className={styles.toastMessage}>{message}</span>
                <button
                    className={styles.toastClose}
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose(), 300);
                    }}
                >
                    ✖
                </button>
            </div>
        </div>
    );
};

ToastNotification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']),
    duration: PropTypes.number,
    onClose: PropTypes.func.isRequired
};

export default ToastNotification;
