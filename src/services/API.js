function requestBioAPI(query, callback) {
    return fetch(`https://opendata.agencebio.org/api/gouv/operateurs?${
        Object.entries(query).map(e => `${e[0]}=${e[1]}`).join('&')
    }`)
        .then(response => callback(response.json()))
        .catch(error => callback({ nbTotal: 0 }));
}

export { requestBioAPI };