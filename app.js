const express = require('express');
const morgan = require('morgan');
const axios = require('axios').default;
require('dotenv').config();

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const REDIRECT_IP = process.env.REDIRECT_IP;
const API_URL = process.env.API_URL;
const SETTINGS_URL = process.env.SETTINGS_URL;
const GUCCHO_MODE = parseBoolean(process.env.GUCCHO_MODE);

const colors = {
    reset: '\x1b[0m',
    blueBright: '\x1b[94m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    greenBright: '\x1b[92m'
};

const logPrefix = `${colors.yellow}[BPY-REDIRECT]${colors.reset}`;
const methodColor = (text) => `${colors.magenta}${text}${colors.reset}`;
const urlColor = (text) => `${colors.cyan}${text}${colors.reset}`;
const statusColor = (status) => {
    if (status >= 500) return `${colors.red}${status}${colors.reset}`;
    if (status >= 400) return `${colors.yellow}${status}${colors.reset}`;
    if (status >= 300) return `${colors.cyan}${status}${colors.reset}`;
    return `${colors.green}${status}${colors.reset}`;
};
const responseTimeColor = (text) => `${colors.greenBright}${text}${colors.reset}`;

app.use(morgan((tokens, req, res) => {
    return [
        logPrefix,
        methodColor('Method:'), methodColor(tokens.method(req, res)), colors.reset + "|",
        urlColor('URL:'), urlColor(tokens.url(req, res)), colors.reset + "|",
        'Status:', statusColor(tokens.status(req, res)), colors.reset + "|",
        responseTimeColor("@" + `${tokens['response-time'](req, res)} ms`)
    ].join(' ');
}));

app.get('/u/:userid', (req, res) => {
    const { userid } = req.params;
    res.redirect(301, `${REDIRECT_IP}/u/${userid}`);
});

app.get('/beatmapsets/:beatmap/discussion', async (req, res) => {
    const { beatmap } = req.params;

    if (GUCCHO_MODE) {
        try {
            const response = await axios.get(`${API_URL}/v1/get_map_info?id=${beatmap}`);
            const mapInfo = response.data.map;

            if (response.data.status === 'Map not found.') {
                return res.status(404).send('Map not found.');
            }

            res.redirect(301, `${REDIRECT_IP}/beatmapset/${mapInfo.set_id}?beatmap=${beatmap}`);
        } catch (error) {
            console.error('Error fetching map info:', error.message);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect(301, `${REDIRECT_IP}/b/${beatmap}`);
    }
});

app.get('/beatmapsets/:set_id/discussion/:beatmap', async (req, res) => {
    const { beatmap, set_id } = req.params;

    if (GUCCHO_MODE) {

        res.redirect(301, `${REDIRECT_IP}/beatmapset/${set_id}?beatmap=${beatmap}`);
        return;
    }
    
    res.redirect(301, `${REDIRECT_IP}/b/${beatmap}`);
});


app.get('/beatmaps/:beatmap', async (req, res) => {
    const { beatmap } = req.params;

    if (GUCCHO_MODE) {
        try {
            const response = await axios.get(`${API_URL}/v1/get_map_info?id=${beatmap}`);
            const mapInfo = response.data.map;

            if (response.data.status === 'Map not found.') {
                return res.status(404).send('Map not found.');
            }

            res.redirect(301, `${REDIRECT_IP}/beatmapset/${mapInfo.set_id}?beatmap=${beatmap}`);
        } catch (error) {
            console.error('Error fetching map info:', error.message);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect(301, `${REDIRECT_IP}/b/${beatmap}`);
    }
});

app.get('/beatmapsets/:beatmap', async (req, res) => {
    const { beatmap } = req.params;

    if (GUCCHO_MODE) {
        try {
            const response = await axios.get(`${API_URL}/v1/get_map_info?id=${beatmap}`);
            const mapInfo = response.data.map;

            res.redirect(301, `${REDIRECT_IP}/beatmapset/${mapInfo.set_id}?beatmap=${beatmap}`);
        } catch (error) {
            console.error('Error fetching map info:', error.message);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect(301, `${REDIRECT_IP}/b/${beatmap}`);
    }
});

app.get('/home/account/edit', (req, res) => {
    res.redirect(301, `${REDIRECT_IP}${SETTINGS_URL}`);
});

const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function parseBoolean(str) {
    if (str === 'true') return true;
    return false;
}
