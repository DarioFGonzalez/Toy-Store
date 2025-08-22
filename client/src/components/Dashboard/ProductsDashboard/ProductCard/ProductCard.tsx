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

    const handleFavorite = () => {
        axios.put(`${URL}product/${product.id}`, { highlighted: !product.highlighted }, { headers: { 'Authorization': `Bearer ${adminToken}` } })
            .then(({ data }) => setProduct(data))
            .catch((err) => console.log(err));
    };

    const handleVisible = () => {
        axios.put(`${URL}product/${product.id}`, { visible: !product.visible }, { headers: { 'Authorization': `Bearer ${adminToken}` } })
            .then(({ data }) => setProduct(data))
            .catch((err) => console.log(err));
    };

    if (!isTableRow) {
        return <></>;
    }

    return (
        <tr key={product.id}>
            <td><img onClick={() => console.log(product)} src={product.imageUrl[0].url} alt={product.name} className={styles.tableImage} /></td>
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
            <td className={styles.cellContainer}>
                <label className={styles.eyeContainer}>
                    <input
                        type="checkbox"
                        id={`visible-${item.id}`}
                        checked={product.visible}
                        onChange={handleVisible}
                    />
                    <svg className={styles.eye} xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path></svg>
                    <svg className={styles.eyeSlash} xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z"></path></svg>
                </label>
            </td>
            <td className={styles.cellContainer}>
                <label className={styles.favContainer}>
                    <input
                        type="checkbox"
                        id={`favorite-${item.id}`}
                        checked={product.highlighted}
                        onChange={handleFavorite}
                        className={styles.favoriteCheckbox}
                    />
                    <svg height="24px" id="Layer_1" version="1.2" viewBox="0 0 24 24" width="24px" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521 c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506 c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625 c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191 s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586 s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></g></g></svg>
                </label>
            </td>
            <td className={styles.cellContainer}>
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