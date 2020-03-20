const formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = document.querySelector('.input__cities-from'),
        dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
        inputCitiesTo = document.querySelector('.input__cities-to'),
        dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
        inputDateDepart = document.querySelector('.input__date-depart');


const citiesApi = 'dataBase/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '4e048fd8e570a5fd8b95a4b9ce428ea8',
    calendar = ' http://min-prices.aviasales.ru/calendar_preload';

let city =[];

// Функции

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) return;
        
        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};

const showCity = (input, list)=> {
    list.textContent = '';

    if (input.value !=='') {

    const filterCity = city.filter((item) => {
        const fixItem = item.name.toLowerCase();
        return fixItem.includes(input.value.toLowerCase());
    });


    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);        
    });

      
    };    
};
const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName === 'LI') {
        const cityName = target.textContent;
        input.value = cityName;
        list.textContent = '';
    }; 
};

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
    console.log(cheapTickets);    
};

const renderCheap = (data, date) => {
    const cheapTicket = JSON.parse(data).best_prices;
    
    console.log('cheapTicket: ', cheapTicket);
    

    const cheapTicketDay = cheapTicket.filter((item) => {
        return item.depart_date === date;
    })

    console.log('cheapTicketDay: ', cheapTicketDay);
    
    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicket);
    
}

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
}); 

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);   
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name).code;
    const cityTo = city.find((item) => inputCitiesTo.value === item.name).code;

    const formData = {
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    }
    
    const requestData = '?depart_date=' + formData.when + 
    '&origin=' + formData.from + 
    '&destination=' + formData.to + 
    '&one_way=true&token=' + API_KEY;

    getData(calendar + requestData, (response) => {
        renderCheap(response, formData.when);      
    });
    
});


// вызов функций

getData(citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => item.name); 
});




/* getData(proxy + calendar + '?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY, (data) => {
    const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-29')
    console.log(cheapTicket);
}) */