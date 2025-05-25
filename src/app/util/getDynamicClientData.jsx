import homelogo from '@images/helixSenseLogo.svg';
import saarthiLight from '@images/saarthi_logo_light.svg';
import saarthiDark from '@images/saarthi_logo_dark.svg';

import {
    getLocalTime
} from './appUtils';

const appConfig = require('../config/appConfig').default;

const clientsJson = {
    sfx: 'SFX',
    default: 'HSENSE'
}


const tabNameJson = {
    sfx: 'SaarthiFX',
    default: 'HelixSense'
}

const logoJson = {
    sfx: [{
        Logo: saarthiLight,
    },
    {
        Logo: saarthiDark,
    }],
    default: { Logo: homelogo }
}

export const getTabName = () =>{
    return tabNameJson[appConfig.CLIENTNAME];
}

export const getExportFileName = (fileName) => {
    const currentDate = getLocalTime(new Date());
    let exportFileName = `${fileName}_On_${currentDate}`
    return exportFileName
}

export const getExportLogo = () => {
    const theme = localStorage.getItem('theme');
    switch (appConfig.CLIENTNAME) {
        case 'sfx':
            if (theme === 'dark-style.css') {
                return logoJson[appConfig.CLIENTNAME][1] && logoJson[appConfig.CLIENTNAME][1].Logo;
            } else {
                return logoJson[appConfig.CLIENTNAME][0] && logoJson[appConfig.CLIENTNAME][0].Logo;
            }
        case 'default':
            return logoJson[appConfig.CLIENTNAME] && logoJson[appConfig.CLIENTNAME].Logo;
    }
}

export const getClientName = () => {
    return clientsJson[appConfig.CLIENTNAME];
}