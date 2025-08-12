import React, { useRef, useState, useEffect } from 'react';
import styles from './ProductCard.module.css';
import type { editForm, Product, ProductCardProps } from '../../../../types';
import axios from 'axios';
import { emptyEditForm, URL } from '../../../../types/constants';

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const [product, setProduct] = useState<Product>(item);
    const [edit, setEdit] = useState<editForm>(emptyEditForm);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const stockInputRef = useRef<HTMLInputElement>(null);
    const priceInputRef = useRef<HTMLInputElement>(null);
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

    const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isVisible = e.target.value === 'true';

        axios.put(`${URL}product/${item.id}`, { visible: isVisible }, { headers: { 'Authorization': `Bearer ${adminToken}` } })
            .then(({ data }) => setProduct(data))
            .catch((err) => console.log("Hubo un error al actualizar la visibilidad del producto. ", err));
    };

    const handleUpdate = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const fieldName = e.currentTarget.name;

        if (e.key === 'Escape') {
            setEdit((prevInfo) => ({ ...prevInfo, [fieldName]: false }));
            return;
        }

        if (e.key !== 'Enter') return;

        const fieldValue = e.currentTarget.value;

        axios.put(`${URL}product/${product.id}`, { [fieldName]: fieldValue }, { headers: { 'Authorization': `Bearer ${adminToken}` } })
            .then(({ data }) => setProduct(data))
            .catch((err) => console.log(err.message));

        setEdit((prevInfo) => ({ ...prevInfo, [fieldName]: false }));
    };

    return (
        <div className={styles.card}>
            <img src={product.imageUrl[0]} alt={product.name} className={styles.cardImage} 
            onClick={()=>console.log(product)}/>

            {!edit.name &&
                <span onClick={() => setEdit(prevInfo => ({ ...prevInfo, name: true }))} className={styles.cardName}>{product.name}</span>
            }
            {edit.name &&
                <input
                    ref={nameInputRef}
                    placeholder={product.name}
                    onKeyDown={handleUpdate}
                    name='name'
                    defaultValue={product.name}
                />
            }

            {!edit.stock &&
                <span onClick={() => setEdit(prevInfo => ({ ...prevInfo, stock: true }))} className={styles.cardStock}>Stock: {product.stock}</span>
            }
            {edit.stock &&
                <input
                    ref={stockInputRef}
                    type='number'
                    placeholder={product.stock.toString()}
                    onKeyDown={handleUpdate}
                    name='stock'
                    defaultValue={product.stock}
                />
            }

            {!edit.price &&
                <span onClick={() => setEdit(prevInfo => ({ ...prevInfo, price: true }))} className={styles.cardStock}>Precio: {product.price}</span>
            }
            {edit.price &&
                <input
                    ref={priceInputRef}
                    type='number'
                    placeholder={product.price.toString()}
                    onKeyDown={handleUpdate}
                    name='price'
                    defaultValue={product.price}
                />
            }

            <div className={styles.visibleActions}>
                <label className={styles.radioLabel}>
                    <input
                        type="radio"
                        name={`visibility-${product.id}`}
                        value="true"
                        checked={product.visible}
                        onChange={handleVisibilityChange}
                    />
                    Visible
                </label>
                <label className={styles.radioLabel}>
                    <input
                        type="radio"
                        name={`visibility-${product.id}`}
                        value="false"
                        checked={!product.visible}
                        onChange={handleVisibilityChange}
                    />
                    No Visible
                </label>
            </div>

        </div>
    );
};

export default ProductCard;