import React, { useRef, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import styles from './ProductCard.module.css';
import type { editForm, Product, ProductCardProps } from '../../../../types';
import axios from 'axios';
import { emptyEditForm, URL } from '../../../../types/constants';

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const [product, setProduct] = useState<Product>(item);
    const [edit, setEdit] = useState<editForm>(emptyEditForm);
    const [descriptionValue, setDescriptionValue] = useState(item.description || '');

    const nameInputRef = useRef<HTMLInputElement>(null);
    const stockInputRef = useRef<HTMLInputElement>(null);
    const priceInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

    const adminToken = localStorage.getItem('adminToken');

    useEffect(() => {
        if (edit.name && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [edit.name]);

    useEffect(() => {
        if (edit.stock && stockInputRef.current) {
            stockInputRef.current.focus();
        }
    }, [edit.stock]);

    useEffect(() => {
        if (edit.price && priceInputRef.current) {
            priceInputRef.current.focus();
        }
    }, [edit.price]);

    useEffect(() => {
        if (edit.description && descriptionInputRef.current) {
            descriptionInputRef.current.focus();
        }
    }, [edit.description]);

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const isVisible = e.target.value === 'true';

        axios.put(`${URL}product/${item.id}`, { visible: isVisible }, { headers: { 'Authorization': `Bearer ${adminToken}` } })
            .then(({ data }) => setProduct(data))
            .catch((err) => console.log("Hubo un error al actualizar la visibilidad del producto. ", err));
    };

    const handleUpdate = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>): void => {
        const fieldName = e.currentTarget.name;

        if (e.key === 'Escape') {
            e.preventDefault();
            setEdit((prevInfo) => ({ ...prevInfo, [fieldName]: false }));
            setDescriptionValue(product.description || '');
            return;
        }

        if (e.key !== 'Enter') return;
        e.preventDefault();

        const fieldValue = e.currentTarget.value;
        const valueToUpdate = (fieldName === 'stock' || fieldName === 'price') ? Number(fieldValue) : fieldValue;

        axios.put(`${URL}product/${product.id}`, { [fieldName]: valueToUpdate }, { headers: { 'Authorization': `Bearer ${adminToken}` } })
            .then(({ data }) => setProduct(data))
            .catch((err) => console.log(err.message));

        setEdit((prevInfo) => ({ ...prevInfo, [fieldName]: false }));
    };

    const handleShow = (value: boolean): void => {
        setEdit(prevInfo => ({ ...prevInfo, description: value }));
        if (value) {
            setDescriptionValue(product.description || '');
        }
    };

    return (
        <div className={styles.card}>
            <img src={product.imageUrl[0]} alt={product.name} className={styles.cardImage} onClick={() => console.log(product)} />

            {!edit.name && <span onClick={() => setEdit(prevInfo => ({ ...prevInfo, name: true }))} className={styles.cardName}>{product.name}</span>}
            {edit.name && <input ref={nameInputRef} placeholder={product.name} onKeyDown={handleUpdate} name='name' defaultValue={product.name} />}

            {!edit.stock && <span onClick={() => setEdit(prevInfo => ({ ...prevInfo, stock: true }))} className={styles.cardStock}>Stock: {product.stock}</span>}
            {edit.stock && <input ref={stockInputRef} type='number' placeholder={product.stock.toString()} onKeyDown={handleUpdate} name='stock' defaultValue={product.stock} />}

            {!edit.price && <span onClick={() => setEdit(prevInfo => ({ ...prevInfo, price: true }))} className={styles.cardStock}>Precio: {product.price}</span>}
            {edit.price && <input ref={priceInputRef} type='number' placeholder={product.price.toString()} onKeyDown={handleUpdate} name='price' defaultValue={product.price} />}

            <Button variant='primary' onClick={() => handleShow(true)} className={styles.detailsButton}>
                Detalles
            </Button>

            <div className={styles.visibleActions}>
                <label className={styles.radioLabel}>
                    <input type="radio" name={`visibility-${product.id}`} value="true" checked={product.visible} onChange={handleVisibilityChange} />
                    Visible
                </label>
                <label className={styles.radioLabel}>
                    <input type="radio" name={`visibility-${product.id}`} value="false" checked={!product.visible} onChange={handleVisibilityChange} />
                    No Visible
                </label>
            </div>

            <Modal show={edit.description} onHide={() => handleShow(false)} centered dialogClassName={styles.modalDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Descripción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea 
                        ref={descriptionInputRef}
                        name='description' 
                        className={styles.modalTextarea} 
                        value={descriptionValue} 
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        placeholder='Escribe la nueva descripción aquí...'
                        onKeyDown={handleUpdate}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleShow(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={() => handleUpdate({ key: 'Enter', currentTarget: descriptionInputRef.current } as React.KeyboardEvent<HTMLTextAreaElement>)}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductCard;