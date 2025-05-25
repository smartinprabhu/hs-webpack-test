import React, { useState, useEffect } from 'react';
import {
    Input, Popover, PopoverHeader, PopoverBody, Button
} from 'reactstrap';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import {
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DynamicColumns = (props) => {
    const { allColumns, columnFields, setColumns, setColumnHide, idNameFilter, classNameFilter } = props
    const [openPopover, setOpenPopover] = useState(false)

    const onClickCheckBox = (addColumn) => {
        if (!addColumn.isVisible) {
            setColumns([...columnFields, ...[addColumn.id]]);
        } else {
            setColumns(columnFields.filter((column) => column !== addColumn.id));
        }
    };
    useEffect(() => {
        if (allColumns && allColumns.length) {
            let array = []
            allColumns.map((column) => {
                if (column.isVisible) {
                    array.push(column)
                }
            })
            setColumnHide(array)
        }
    }, [allColumns, columnFields])

    return (
        <>
            <Button className="cursor-pointer font-11 border-color-red-gray bg-white text-dark rounded-pill py-1 hoverColor" id={idNameFilter || 'addColumn'} onClick={() => setOpenPopover(true)}>
                Columns
                <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faChevronDown} />
            </Button>
            {openPopover && (<Popover trigger="legacy" className={classNameFilter || ''} target={idNameFilter || 'addColumn'} placement="bottom" toggle={() => setOpenPopover(false)} isOpen={openPopover}>
                <PopoverHeader>
                    Columns
                    <img
                        aria-hidden="true"
                        alt="close"
                        src={closeCircleIcon}
                        onClick={() => setOpenPopover(false)}
                        className="cursor-pointer mr-1 mt-1 float-right"
                    />
                </PopoverHeader>
                <PopoverBody>
                    <div className="filter-popover thin-scrollbar">
                        {allColumns.map((column) => (
                            <div key={column.id}>
                                <Input type="checkbox" {...column.getToggleHiddenProps()} className="ml-0" checked={column.isVisible} value={column.isVisible} onClick={() => onClickCheckBox(column)} />
                                <span className="ml-2">
                                    {column.Header}
                                </span>
                            </div>
                        ))}
                    </div>
                </PopoverBody>
            </Popover>)}
        </>
    )
}
export default DynamicColumns


