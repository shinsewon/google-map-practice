import React from 'react';
import {Icon} from '@iconify/react-with-api'
import fireIcon from '@iconify/icons-emojione/fire'

const MyComponent = () => {
    return (
        <div className={'header-bar'}>
            <Icon icon={fireIcon}/> 날씨 이벤트
        </div>
    );
};

export default MyComponent;
