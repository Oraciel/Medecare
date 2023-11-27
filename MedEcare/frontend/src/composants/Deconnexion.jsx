import React from 'react';

const Deconnexion = ({ onDeconnexion }) => {
    const handleLogout = () => {
        // On enleve le token du localStorage
        localStorage.removeItem('token');
        // On previent le parent qu'on s'est deconnecte
        onDeconnexion();
    };

    return (
        <div className="button-right">
            <button onClick={handleLogout} className="btn-deconnexion">DÉCONNEXION</button>
        </div>
    );
};

export default Deconnexion;
