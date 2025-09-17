import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperModalProps {
    show: boolean;
    imageSrc: string;
    onClose: () => void;
    onCropComplete: (file: File) => void;
}

const ImageCropperModal: React.FC<ImageCropperModalProps> = ({ show, imageSrc, onClose, onCropComplete }) => {
    const [crop, setCrop] = useState<Crop>();
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { width, height } = e.currentTarget;
        setImageElement(e.currentTarget);
        setCrop(centerAspectCrop(width, height, 16 / 9));
    };

    const getCroppedImage = async () => {
        if (!imageElement || !completedCrop) {
            return;
        }

        const scaleX = imageElement.naturalWidth / imageElement.width;
        const scaleY = imageElement.naturalHeight / imageElement.height;
        const pixelCrop = {
            x: completedCrop.x * scaleX,
            y: completedCrop.y * scaleY,
            width: completedCrop.width * scaleX,
            height: completedCrop.height * scaleY,
        };

        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(
            imageElement,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg'));
        if (blob) {
            const croppedFile = new File([blob], 'cropped-banner.jpeg', { type: 'image/jpeg' });
            onCropComplete(croppedFile);
            onClose();
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Recortar Imagen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {imageSrc && (
                    <ReactCrop
                        crop={crop}
                        onChange={(c: Crop) => setCrop(c)}
                        onComplete={(c: PixelCrop) => setCompletedCrop(c)}
                        aspect={16 / 9}
                    >
                        <img src={imageSrc} onLoad={onImageLoad} />
                    </ReactCrop>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={getCroppedImage}>
                    Recortar y Subir
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

// Helper function
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export default ImageCropperModal;