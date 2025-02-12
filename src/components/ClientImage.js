import React, { useEffect, useState } from "react";

const ClientImage = ({ clientPicture, clientProof }) => {
    const [pictureSrc, setPictureSrc] = useState("");
    const [proofSrc, setProofSrc] = useState("");

    useEffect(() => {
        if (clientPicture) {
            setPictureSrc(`http://localhost:8080/client/uploads/${clientPicture}`);
        }
        if (clientProof) {
            setProofSrc(`http://localhost:8080/client/uploads/${clientProof}`);
        }
    }, [clientPicture, clientProof]);

    return (
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {/* Client Picture */}
            <div>
                <p><strong>Client Picture:</strong></p>
                {pictureSrc ? (
                    <img 
                        src={pictureSrc} 
                        alt="Client" 
                        style={{ width: "200px", height: "200px", borderRadius: "10px" }} 
                    />
                ) : (
                    <p>No Image Available</p>
                )}
            </div>

            {/* Client Proof */}
            <div>
                <p><strong>Client Proof:</strong></p>
                {proofSrc ? (
                    <img 
                        src={proofSrc} 
                        alt="Client Proof" 
                        style={{ width: "200px", height: "200px", borderRadius: "10px" }} 
                    />
                ) : (
                    <p>No Image Available</p>
                )}
            </div>
        </div>
    );
};

export default ClientImage;
