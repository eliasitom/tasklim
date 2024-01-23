import { useEffect, useState } from "react"


const useDimensions = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        // Agrega el evento de escucha para el cambio de tamaño de la ventana
        window.addEventListener('resize', handleResize);

        // Limpia el evento de escucha al desmontar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Sin dependencias para que solo se ejecute una vez durante el montaje del componente

    return { windowWidth, windowHeight };
};

export default useDimensions