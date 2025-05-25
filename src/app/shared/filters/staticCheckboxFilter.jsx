/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
    Label, Input, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import closeCircleIcon from '@images/icons/closeCircle.svg';

const staticCheckboxFilter = (props) => {
    const {
        data, dataGroup, selectedValues, onCheckboxChange, toggleClose, target, openPopover, title, setDataGroup, keyword
    } = props;

    const handleCheckboxChange = (event) => {
        onCheckboxChange(event);
    };
    useEffect(() => {
        if (openPopover && keyword && keyword.length > 1) {
            const ndata = data.filter((item) => {
                const searchValue = item.label ? item.label.toString().toUpperCase() : '';
                const s = keyword.toString().toUpperCase();
                return (searchValue.search(s) !== -1);
            });
            setDataGroup(ndata);
        } else {
            setDataGroup(data);
        }
    }, [openPopover, keyword])

    return (
        <>
            <div>
                <Popover className="Add-Columns" trigger="legacy" target={target} toggle={toggleClose} placement="bottom" isOpen={openPopover}>
                    <PopoverHeader>
                        {title}
                        <img
                            aria-hidden="true"
                            alt="close"
                            src={closeCircleIcon}
                            onClick={toggleClose}
                            className="cursor-pointer mr-1 mt-1 float-right"
                        />
                    </PopoverHeader>
                    <PopoverBody>
                        {dataGroup && dataGroup.length ? dataGroup.map((mt) => (
                            <span className="mb-1 d-block font-weight-500" key={mt.value}>
                                <div className="checkbox">
                                    <Input
                                        type="checkbox"
                                        id={`checkboxasaction${mt.value}`}
                                        name={mt.label}
                                        value={mt.value}
                                        checked={selectedValues.some((selectedValue) => selectedValue === mt.value)}
                                        onChange={handleCheckboxChange}
                                    />
                                    <Label htmlFor={`checkboxasaction${mt.value}`}>
                                        <span>{mt.label}</span>
                                    </Label>
                                    {' '}
                                </div>
                            </span>
                        )) : ''}
                    </PopoverBody>
                </Popover>
            </div>
        </>
    );
};

staticCheckboxFilter.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    selectedValues: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onCollapse: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onCheckboxChange: PropTypes.func.isRequired,
};

export default staticCheckboxFilter;


