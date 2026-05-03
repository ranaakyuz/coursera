document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const btnReset = document.getElementById('btnReset');
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results-container');
    const heroContent = document.getElementById('hero-content');

    let travelData = {};

    // 1. Verileri Çek
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            travelData = data;
        })
        .catch(error => console.error('Veri çekme hatası:', error));

    // 2. Arama Butonu Tıklanınca
    btnSearch.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        resultsContainer.innerHTML = ''; // Eski sonuçları temizle
        
        if (query) {
            heroContent.style.display = 'none'; // Ana yazıyı gizle
            resultsContainer.style.display = 'grid'; // Grid sistemini aç
            
            let results = [];

            // Arama Mantığı
            if (query.includes('beach')) {
                results = travelData.beaches;
            } else if (query.includes('temple')) {
                results = travelData.temples;
            } else if (query.includes('country') || query.includes('countries')) {
                travelData.countries.forEach(country => {
                    results = results.concat(country.cities);
                });
            } else {
                const specificCountry = travelData.countries.find(c => c.name.toLowerCase() === query);
                if (specificCountry) {
                    results = specificCountry.cities;
                }
            }

            // Sonuçları HTML formatında ekrana bas
            if (results && results.length > 0) {
                results.forEach(item => {
                    let timeHTML = "";
                    if (item.timeZone) {
                        const options = { timeZone: item.timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                        const localTime = new Date().toLocaleTimeString('en-US', options);
                        timeHTML = `<p style="margin-top:10px; font-weight:bold; color:#178973;">Local Time: ${localTime}</p>`;
                    }

                    // *** İŞTE BURASI BEYAZ KARTLARI OLUŞTURUYOR ***
                    const card = document.createElement('div');
                    card.classList.add('result-card');
                    card.innerHTML = `
                        <img src="${item.imageUrl}" alt="${item.name}">
                        <div class="card-body">
                            <h3 style="color:#0e2a36; margin-bottom:10px; font-size:20px;">${item.name}</h3>
                            <p style="color:#333; font-size:15px; line-height:1.4;">${item.description}</p>
                            ${timeHTML}
                        </div>
                    `;
                    resultsContainer.appendChild(card);
                });
            } else {
                resultsContainer.innerHTML = `<h2 style="color:white; grid-column: 1 / -1;">"${query}" için sonuç bulunamadı. "beach", "temple" veya "country" kelimelerini deneyin.</h2>`;
            }
        }
    });

    // 3. Clear (Temizle) Butonu
    btnReset.addEventListener('click', () => {
        searchInput.value = '';
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        heroContent.style.display = 'block'; 
    });
});