import React, { useState, useEffect } from 'react';
import './Profile.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const ItemType = 'PRODUCT';
const __url = `${process.env.REACT_APP_API_BASE}${process.env.REACT_APP_DATA_URL}`;

const Modal = ({ show, onClose, onSave, product, theme, t }) => {
  const [name, setName] = useState(product.name || '');
  const [price, setPrice] = useState(product.price || 0);
  const [image, setImage] = useState(product.image || '');

  useEffect(() => {
    setName(product.name || '');
    setPrice(product.price || 0);
    setImage(product.image || '');
  }, [product]);

  if (!show) return null;

  return (
    <div className={`modal-backdrop ${theme}`} onClick={onClose}>
      <div className={`modal-content ${theme}`} onClick={(e) => e.stopPropagation()}>
        <h2>{t.editProduct}</h2>
        <label>
          {t.name}:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          {t.price}:
          <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
        </label>
        <label>
          {t.image}:
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        </label>
        <div className="modal-actions">
          <button onClick={() => onSave(name, price, image)}>{t.save}</button>
          <button onClick={onClose}>{t.cancel}</button>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, index, moveCard, handleEdit, handleDelete, theme, t }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className={`product-card ${theme}`}>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{t.price}: ${product.price}</p>
      <div className="actions">
        <button onClick={() => handleEdit(product)}>
          <FaEdit />
        </button>
        <button onClick={() => handleDelete(product.id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const Profile = ({ theme, products, t, token, userId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productList, setProductList] = useState(
    products.map((product, index) => ({
      ...product,
      id: product.id || `temp-id-${index}`,
    }))
  );

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setModalVisible(true);
  };

  const handleSave = async (name, price, image) => {
    try {
      if (currentProduct && currentProduct.id) {
        const updatedProduct = { ...currentProduct, name, price, image };
        await axios.put(`${__url}/products/${userId}`, updatedProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductList((prev) => prev.map((p) => (p.id === currentProduct.id ? updatedProduct : p)));
      } else {
        const newProduct = { name, price, image, order: productList.length };
        const response = await axios.post(`${__url}/products/${userId}`, newProduct, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProductList(response.data);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Ошибка при сохранении продукта:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${__url}/products/${userId}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductList((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
    }
  };

  const moveCard = (fromIndex, toIndex) => {
    const updatedProducts = [...productList];
    const [movedItem] = updatedProducts.splice(fromIndex, 1);
    updatedProducts.splice(toIndex, 0, movedItem);
    setProductList(updatedProducts);
    saveProductOrder(updatedProducts);
  };

  const saveProductOrder = async (updatedProducts) => {
    try {
      const order = updatedProducts
        .filter((p) => p.id)
        .map((p, index) => ({ id: p.id, order: index }));

      await axios.put(`${__url}/products/${userId}/order`, { order }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Ошибка при сохранении порядка продуктов:', error);
    }
  };

  return (
    <div className={`profile ${theme}`}>
      <h1>{t.shopTitle}</h1>
      <h2 className='flex'>{t.shopName} <button
        className="add-product"
        onClick={() => {
          setCurrentProduct({ name: '', price: 0, image: '' });
          setModalVisible(true);
        }}
      >
        {t.addProduct}
      </button></h2>

      <DndProvider backend={HTML5Backend}>
        <div className="products">
          {productList.length === 0 ? (
            <p>{t.noProductsFound}</p>
          ) : (
            productList.map((product, index) => (
              <ProductCard
                key={product.id || `temp-id-${index}`}
                index={index}
                product={product}
                moveCard={moveCard}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                theme={theme}
                t={t}
              />
            ))
          )}
        </div>
      </DndProvider>
      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        product={currentProduct || {}}
        theme={theme}
        t={t}
        token={token}
      />
    </div>
  );
};

export default Profile;
