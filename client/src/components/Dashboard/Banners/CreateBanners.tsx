import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from './CreateBanners.module.css';
import type { Banner, BannerForm, DBImagesFormat } from '../../../types';
import { emptyBannerForm, URL } from '../../../types/constants';
import ImageCropperModal from './ImageCropperModal/ImageCropperModal';

const CreateBanner: React.FC = () => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [form, setForm] = useState<BannerForm>(emptyBannerForm);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState<boolean>(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data } = await axios.get(`${URL}banner`);
            setBanners(data);
        } catch (error) {
            console.error("Error al obtener los banners:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageToCrop(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = (croppedFile: File) => {
        setImageFile(croppedFile);
        setPreviewImage(window.URL.createObjectURL(croppedFile));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm(prevForm => ({ ...prevForm, category: e.target.value }));
    };

    const handleActiveChange = (id: string) => async () => {
        const adminToken = localStorage.getItem('adminToken');
        const bannerToUpdate = banners.find(b => b.id === id);

        if (!bannerToUpdate) return;

        try {
            const { data } = await axios.patch(`${URL}banner/${id}`, { active: !bannerToUpdate.active }, { headers: { 'Authorization': `Bearer ${adminToken}` } });
            setBanners(prevBanners => prevBanners.map(b => b.id === id ? data : b));
        } catch (error) {
            console.error("Error al cambiar el estado del banner:", error);
        }
    };

    const handleDelete = (id: string) => async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este banner?')) return;
        
        const adminToken = localStorage.getItem('adminToken');
        try {
            await axios.delete(`${URL}banner/${id}`, { headers: { 'Authorization': `Bearer ${adminToken}` } });
            setBanners(prevBanners => prevBanners.filter(b => b.id !== id));
            alert('Banner eliminado correctamente.');
        } catch (error) {
            console.error("Error al eliminar el banner:", error);
            alert('Hubo un error al eliminar el banner.');
        }
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!imageFile || form.category === 'default') {
            alert('Por favor, sube una imagen y selecciona una categoría.');
            return;
        }

        try {
            const uploadedImage = await handleImageUpload();
            const adminToken = localStorage.getItem('adminToken');

            const newBannerData: BannerForm = {
                imageUrl: uploadedImage,
                category: form.category,
                active: false,
            };

            await axios.post(`${URL}banner`, newBannerData, { headers: { 'Authorization': `Bearer ${adminToken}` } });
            alert('¡Banner creado y subido!');

            setForm(emptyBannerForm);
            setImageFile(null);
            setPreviewImage(null);
            fetchBanners();

        } catch (error) {
            console.error({ Error_HandleSubmit: error });
            alert('¡Ocurrió un error!');
        }
    };

    const handleImageUpload = async (): Promise<DBImagesFormat> => {
        const formData = new FormData();
        formData.append('file', imageFile!);
        formData.append('upload_preset', 'violeta_store');
        
        const response = await axios.post(`https://api.cloudinary.com/v1_1/violetastore/upload`, formData);
        
        return {
            url: response.data.secure_url,
            public_id: response.data.public_id,
        };
    };

    return (
        <div className={styles.container}>
            <div className={styles.formSection}>
                <h1>Crear nuevo Banner</h1>
                <Form onSubmit={handleSubmit} className={styles.form}>
                    <Form.Group className="mb-3">
                        <Form.Label>Subir Imagen</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                        {previewImage && (
                            <div className={styles.previewContainer}>
                                <img src={previewImage} alt="Preview Banner" className={styles.previewImage} />
                            </div>
                        )}
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select name='category' value={form.category} onChange={handleCategoryChange}>
                            <option value='default' disabled>Seleccionar categoría...</option>
                            <option value='descuentos'> Descuentos </option>
                            <option value='tematico'> Temático </option>
                            <option value='anuncios'> Anuncios </option>
                            <option value='otros'> Otros </option>
                        </Form.Select>
                    </Form.Group>
                    
                    <Button variant="primary" type="submit">
                        Subir Banner
                    </Button>
                </Form>
            </div>

            <div className={styles.bannersSection}>
                <h2>Banners Existentes</h2>
                <div className={styles.bannersList}>
                    {banners.length > 0 ? (
                        banners.map(banner => (
                            <div key={banner.id} className={styles.bannerCard}>
                                <img src={banner.imageUrl.url} alt={`Banner ${banner.id}`} className={styles.bannerImage} />
                                <div className={styles.bannerInfo}>
                                    <p>Categoría: **{banner.category}**</p>
                                    <p>Estado: 
                                        <span className={banner.active ? styles.active : styles.inactive}>
                                            **{banner.active ? 'Activo' : 'Inactivo'}**
                                        </span>
                                    </p>
                                    <div className={styles.buttonGroup}>
                                        <Button
                                            variant={banner.active ? "warning" : "success"}
                                            onClick={handleActiveChange(banner.id)}
                                        >
                                            {banner.active ? 'Desactivar' : 'Activar'}
                                        </Button>
                                        <Button variant="danger" onClick={handleDelete(banner.id)}>
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay banners para mostrar.</p>
                    )}
                </div>
            </div>

            {showCropper && (
                <ImageCropperModal
                    show={showCropper}
                    imageSrc={imageToCrop!}
                    onClose={() => setShowCropper(false)}
                    onCropComplete={handleCropComplete}
                />
            )}
        </div>
    );
};

export default CreateBanner;