import React, { useRef, useState, useEffect } from 'react';
import styles from './ProductCard.module.css';
import type { editForm, Product, ProductCardProps } from '../../../../types';
import axios from 'axios';
import { emptyEditForm, URL } from '../../../../types/constants';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

interface Props extends ProductCardProps {
    isTableRow?: boolean;
}

const ProductCard: React.FC<Props> = ({ item, isTableRow }) => {
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
        if (edit.stock && stockInputRef.current) {
            stockInputRef.current.focus();
        }
        if (edit.price && priceInputRef.current) {
            priceInputRef.current.focus();
        }
        if (edit.description && descriptionInputRef.current) {
            descriptionInputRef.current.focus();
        }
    }, [edit]);

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

    const handleFavorite = () =>
    {
        axios.put(`${URL}product/${product.id}`, { highlighted: !product.highlighted }, { headers: { 'Authorization': `Bearer ${adminToken}` } } )
        .then( ( { data } ) => setProduct( data ) )
        .catch( ( err ) => console.log( err ) );
    }

    if (!isTableRow) {
        return <></>;
    }

    return (
        <tr key={product.id}>
            <td><img onClick={()=>console.log(product)} src={product.imageUrl?.[0]} alt={product.name} className={styles.tableImage} /></td>
            <td onClick={() => setEdit(prevInfo => ({ ...prevInfo, name: true }))}>
                {edit.name ? (
                    <input ref={nameInputRef} placeholder={product.name} onKeyDown={handleUpdate} name='name' defaultValue={product.name} className={styles.tableInput} />
                ) : (
                    <span>{product.name}</span>
                )}
            </td>
            <td onClick={() => setEdit(prevInfo => ({ ...prevInfo, stock: true }))}>
                {edit.stock ? (
                    <input ref={stockInputRef} type='number' placeholder={product.stock.toString()} onKeyDown={handleUpdate} name='stock' defaultValue={product.stock} className={styles.tableInput} />
                ) : (
                    <span>{product.stock}</span>
                )}
            </td>
            <td onClick={() => setEdit(prevInfo => ({ ...prevInfo, price: true }))}>
                {edit.price ? (
                    <input ref={priceInputRef} type='number' placeholder={product.price.toString()} onKeyDown={handleUpdate} name='price' defaultValue={product.price} className={styles.tableInput} />
                ) : (
                    <span>$ {product.price}</span>
                )}
            </td>
            <td>
                <label className={styles.visibleLabel}>
                    <input type="radio" name={`visibility-${product.id}`} value="true" checked={product.visible} onChange={handleVisibilityChange} /> Sí
                </label>
                <label className={styles.visibleLabel}>
                    <input type="radio" name={`visibility-${product.id}`} value="false" checked={!product.visible} onChange={handleVisibilityChange} /> No
                </label>
            </td>
            <td>
                <input
                    type="checkbox"
                    id={`favorite-${item.id}`}
                    checked={product.highlighted}
                    onChange={handleFavorite}
                    className={styles.favoriteCheckbox}
                />
                <label htmlFor={`favorite-${item.id}`} className={styles.favoriteLabel}>
                    🤍
                </label>
            </td>
            <td>
                <Button variant="info" size="sm" onClick={() => handleShow(true)}>Editar</Button>
            </td>
                        <Modal show={edit.description} onHide={() => handleShow(false)} centered dialogClassName={styles.modalDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar descripción</Modal.Title>
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
                    <span>[ENTER] para aceptar los cambios.</span>
                </Modal.Footer>
            </Modal>
        </tr>
        
    );
};

export default ProductCard;