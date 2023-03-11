/**
 *
 * AddProduct
 *
 */

import React from 'react';

import { Row, Col } from 'reactstrap';

import { ROLES } from '../../../constants';
import Input from '../../Common/Input';
import Switch from '../../Common/Switch';
import Button from '../../Common/Button';
import SelectOption from '../../Common/SelectOption';

const taxableSelect = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' }
];

const AddAuction = props => {
  const {
    user,
    productFormData,
    formErrors,
    auctionChange,
    addAuction,
    brands,
    image
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addAuction();
  };

  return (
    <div className='add-product'>
      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12' md='12'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={'Name'}
              name={'name'}
              placeholder={'Auction Project Name'}
              value={productFormData.name}
              onInputChange={(name, value) => {
                auctionChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={'Description'}
              name={'description'}
              placeholder={'Auction Description'}
              value={productFormData.description}
              onInputChange={(name, value) => {
                auctionChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'number'}
              error={formErrors['price']}
              label={'Base Price'}
              name={'price'}
              min={1}
              placeholder={'Base Price'}
              value={productFormData.price}
              onInputChange={(name, value) => {
                auctionChange(name, value);
              }}
            />
          </Col>
          
          <Col xs='12' lg='6'>
            <Input
              type={'number'}
              error={formErrors['duration']}
              label={'Duration'}
              name={'duration'}
              min={1}
              placeholder={'Product Duration'}
              value={productFormData.duration}
              onInputChange={(name, value) => {
                auctionChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <SelectOption
              disabled={user.role === ROLES.Merchant}
              error={formErrors['brand']}
              name={'brand'}
              label={'Select Brand'}
              value={
                user.role === ROLES.Merchant ? brands[1] : productFormData.brand
              }
              options={brands}
              handleSelectChange={value => {
                auctionChange('brand', value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'file'}
              error={formErrors['file']}
              name={'image'}
              label={'file'}
              placeholder={'Please Upload Image'}
              value={image}
              onInputChange={(name, value) => {
                auctionChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='add-product-actions'>
          <Button type='submit' text='Add Auction' />
        </div>
      </form>
    </div>
  );
};

export default AddAuction;
