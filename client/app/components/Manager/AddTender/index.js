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

const AddTender = props => {
  const {
    user,
    productFormData,
    formErrors,
    tenderChange,
    addTender,
    image
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    addTender();
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
              placeholder={'Tender Project Name'}
              value={productFormData.name}
              onInputChange={(name, value) => {
                tenderChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'textarea'}
              error={formErrors['description']}
              label={'Description'}
              name={'description'}
              placeholder={'Tender Description'}
              value={productFormData.description}
              onInputChange={(name, value) => {
                tenderChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'number'}
              error={formErrors['price']}
              label={'Base Price'}
              name={'price'}
              min={1}
              placeholder={'Base Price'}
              value={productFormData.price}
              onInputChange={(name, value) => {
                tenderChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
            className="input-group input-text"
              type={'date'}
              error={formErrors['startingDate']}
              label={'Starting Date'}
              name={'startingDate'}
              value={productFormData.startingDate}
              onInputChange={(name, value) => {
                tenderChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' lg='6'>
            <Input
              type={'date'}
              error={formErrors['endingDate']}
              label={'Ending Date'}
              name={'endingDate'}
              value={productFormData.endingDate}
              onInputChange={(name, value) => {
                tenderChange(name, value);
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
                tenderChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='add-product-actions'>
          <Button type='submit' text='Add Tender' />
        </div>
      </form>
    </div>
  );
};

export default AddTender;
