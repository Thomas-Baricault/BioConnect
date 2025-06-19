function requestAPI(query) {
    return fetch(`https://opendata.agencebio.org/api/gouv/operateurs?${
        Object.entries(query).map(e => `${e[0]}=${e[1]}`).join('&')
    }`)
        .then(response => response.json())
        .catch(error => ({error: error}));
}

export default requestAPI;