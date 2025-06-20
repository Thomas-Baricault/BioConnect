function requestBioAPI(query, callback) {
    fetch(`https://opendata.agencebio.org/api/gouv/operateurs?${
        Object.entries(query).map(e => `${e[0]}=${e[1]}`).join('&')
    }`)
        .then(response => response.json())
        .then(response => callback(response))
        .catch(error => callback({ nbTotal: 0, error: error }));
}

export { requestBioAPI };