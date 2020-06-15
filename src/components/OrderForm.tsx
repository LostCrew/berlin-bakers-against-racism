import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress, Grid, Typography } from '@material-ui/core';

import { submitOrder } from "../gateway/GoogleData";
import { AppContext, AppState } from "../context/AppState";
import DonorInfo from "./DonorInfo";
import Menu from "./Menu";
import { Donor } from '../context/domain';

const initialValues: Donor = {
  emailAddress: "",
  fullName: "",
  phoneNumber: "",
  address: "",
  specialInstructions: "",
};

const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

const validate = (values: Donor) => {
  const errors: Partial<Donor> = {};
  if (!values.emailAddress) {
    errors.emailAddress = 'Required';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.emailAddress)
  ) {
    errors.emailAddress = 'Invalid email address';
  }
  return errors;
}

const OrderForm = () => {
  const { state, dispatch } = React.useContext(AppContext);
  
  const submit = async (values: Donor, { setSubmitting }: any) => {
    try {
      const result = await submitOrder({ donor: values, cart: state.cart });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={submit}
    >
      {({ submitForm, isSubmitting }) => (
        <Grid container>
          <Form>
            <Menu />
            <br />
            <DonorInfo />
            <br />
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                Total amount: {currencyFormatter.format(state.cart.totalAmount)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {isSubmitting && <LinearProgress />}
              <br />
              <Button
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
              >Submit order</Button>
            </Grid>
          </Form>
        </Grid>
      )}
    </Formik>
  );
};

export default OrderForm;