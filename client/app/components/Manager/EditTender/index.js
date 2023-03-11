/**
 *
 * EditProduct
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
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

const EditTender = props => {
  const {
    user,
    product,
    tenderChange,
    formErrors,
    brands,
    updateTender,
    deleteTender,
  } = props;

  const handleSubmit = event => {
    event.preventDefault();
    updateTender();
  };

  return (
    <div className='edit-product'>
      <div className='d-flex flex-row mx-0 mb-3'>
        <label className='mr-1'>Tender link </label>
        <Link to={`/Auction/${product.name}`} className='default-link'>
          {product.name}
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <Row>
          <Col xs='12'>
            <Input
              type={'text'}
              error={formErrors['name']}
              label={'Name'}
              name={'name'}
              placeholder={'Tender Name'}
              value={product.name}
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
              placeholder={'Product Description'}
              value={product.description}
              onInputChange={(name, value) => {
                tenderChange(name, value);
              }}
            />
          </Col>
          
          <Col xs='12' lg='6'>
            <Input
              type={'date'}
              error={formErrors['startingDate']}
              label={'Start Date'}
              name={'startingDate'}
              decimals={false}
              value={product.startingDate}
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
              decimals={false}
              value={product.endingDate}
              onInputChange={(name, value) => {
                tenderChange(name, value);
              }}
            />
          </Col>
          <Col xs='12' md='12'>
            <Input
              type={'number'}
              error={formErrors['price']}
              label={'Price'}
              name={'price'}
              min={1}
              placeholder={'Product Price'}
              value={product.price}
              onInputChange={(name, value) => {
                tenderChange(name, value);
              }}
            />
          </Col>
        </Row>
        <hr />
        <div className='d-flex flex-column flex-md-row'>
          <Button
            type='submit'
            text='Save'
            className='mb-3 mb-md-0 mr-0 mr-md-3'
          />
          <Button
            variant='danger'
            text='Delete'
            onClick={() => deleteTender(product._id)}
          />
        </div>
      </form>
    </div>
  );
};

export default EditTender;
