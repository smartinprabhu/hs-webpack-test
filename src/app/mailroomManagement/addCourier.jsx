import React, { useState } from 'react';
import {
    Col,
    Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ThemeProvider } from '@material-ui/core/styles';
import {
    TextField,
} from '@material-ui/core';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import { addCourierData } from './mailService'
import { useSelector, useDispatch } from 'react-redux';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import theme from '../util/materialTheme';

const appModels = require('../util/appModels').default;

const AddCourierComponent = ({ reset }) => {
    const formInitialValues = {
        name: '',
        company_id: '',
    };
    const currentValidationSchema = Yup.object().shape({
        name: Yup.string()
            .nullable()
            .required('Name is required'),
    });
    const [companyOpen, setCompanyOpen] = useState(false);
    const { allowedCompanies } = useSelector((state) => state.setup);
    const { userInfo } = useSelector((state) => state.user);
    const { addCourier } = useSelector((state) => state.mailroom);

    const dispatch = useDispatch();

    const handleSubmit = (values) => {
        const postData = { values: { name: values.name, company_id: userInfo.data.company.id }, model: appModels.MAILCOURIER }
        dispatch(addCourierData(appModels.MAILCOURIER, postData))

    }

    const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
        ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

    return (
        <>
            <Formik
                initialValues={formInitialValues}
                validationSchema={currentValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isValid, dirty }) => (
                    <Form id="filter_frm">
                        <ThemeProvider theme={theme}>
                            <>
                                {addCourier && !addCourier.data && !addCourier.err && (
                                    <Row>
                                        <Col xs={6} sm={6} lg={6} md={6}>
                                            <InputField
                                                name="name"
                                                label="Name"
                                                type="text"
                                                autoComplete="off"
                                                disabled={addCourier && addCourier.loading}
                                            />
                                        </Col>
                                        <Col xs={6} sm={6} lg={6} md={6}>
                                            <FormikAutocomplete
                                                name="company_id"
                                                label="Company"
                                                className="bg-white"
                                                open={companyOpen}
                                                size="small"
                                                disabled
                                                value={userInfo.data.company}
                                                onOpen={() => {
                                                    setCompanyOpen(true);
                                                }}
                                                onClose={() => {
                                                    setCompanyOpen(false);
                                                }}
                                                getOptionSelected={(option, value) => option.name === value.name}
                                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                                options={userCompanies}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        className="without-padding custom-icons"
                                                        placeholder="Search & Select"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Col>

                                    </Row>
                                )}
                                {addCourier && addCourier.err && (
                                    <SuccessAndErrorFormat response={addCourier} />
                                )}
                                {addCourier && addCourier.loading && (
                                    <Loader />
                                )}
                                {(addCourier && addCourier.data) && (
                                    <div className='text-center text-success'>
                                        Courier added successfully..
                                    </div>
                                )}
                                <hr />
                                <div className="float-right">
                                    {addCourier && !addCourier.data && !addCourier.err && (<Button
                                        disabled={!(isValid && dirty) ||
                                            (addCourier && addCourier.loading)}
                                        type="submit"
                                         variant="contained"
                                        className="mb-2"
                                    >
                                        Add
                                    </Button>)}
                                    {addCourier && (addCourier.err || addCourier.data) && (<Button
                                        type="submit"
                                         variant="contained"
                                        className="mb-2"
                                        onClick={() => { reset(); }}
                                    >
                                        ok
                                    </Button>)}
                                </div>

                            </>
                        </ThemeProvider>
                    </Form>
                )}
            </Formik>
        </>
    )
}
export default AddCourierComponent