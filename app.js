//API key
const key = '';
const baseURL = 'https://api.nps.gov/api/v1/parks';

function formatParams(obj) {
    const params = Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`);
    console.log(params);
    return params.join('&');
}

function fetchAPI(state,range) {
    const option = new Headers ({'X-Api-Key': key});
    let query = {
        stateCode: state,
        limit: range,
        fields: 'addresses'
    }
    const queryParams = formatParams(query);
    const url= baseURL + "?" + queryParams;
    fetch(url,option)
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error("something is not right")
        })
    .then(responseJSON => renderHTML(responseJSON.data))
    .catch(err=> alert(err.message));
}

function renderHTML(data) {
    $('.result').prop('hidden', false);
    console.log(data);
    let resultData = data.map(park => {
        let {fullName, states, description,url,addresses} = park;
        let address=""
        for(let i=0; i<addresses.length; i++) {
            if(addresses[i].type === "Physical") {
                let {line1, line2, line3, city, postalCode, stateCode} = addresses[i];
                address = `${line1}<br>${line2} ${line3}<br>${city} ${stateCode}, ${postalCode}`;
            }
        }
        return `<p>Park Name: ${fullName}<br>State: ${states}<br>Description: ${description}<br>URL: <a href="${url}" target="_blank">${url}</a><br><br>Address:<br> ${address}</p>`
    });
    $('.js-result').html(resultData)
}

function catchSubmit() {
    $('.search').submit(event=>{
        event.preventDefault();
        let state = $('input[name="state"]').val().replace(/\s+/g,"");
        console.log(state);
        let range = $('input[name="range"]').val();
        fetchAPI(state,range)
    })
}

$(catchSubmit)