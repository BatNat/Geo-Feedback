require('./foundation.js');
require('./foundation.css');

const plus = require('./img/plus.svg');
const balloonInit = require('./js/balloon.js');

let placesMap = new Map();
let yMap;
let clusterer;
let geoObjects = [];

(async() => {
    try {
        await ymaps.ready();

         yMap = new ymaps.Map('map', {
            center: [55.76, 37.64], // Москва
            zoom: 14
        }, {
            searchControlProvider: 'yandex#search'
        }, );

        // Создаем собственный макет с информацией о выбранном геообъекте.
        let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
            // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
            '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
            '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
            '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
        );

        clusterer = new ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            clusterDisableClickZoom: true,
            gridSize: 110,
            iconColor: 'islands#violetIcon',
            clusterOpenBalloonOnClick: true,
            // Устанавливаем стандартный макет балуна кластера "Карусель".
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            // Устанавливаем собственный макет.
            clusterBalloonItemContentLayout: customItemContentLayout,
            // Устанавливаем режим открытия балуна.
            // В данном примере балун никогда не будет открываться в режиме панели.
            clusterBalloonPanelMaxMapArea: 0,
            // Устанавливаем размеры макета контента балуна (в пикселях).
            clusterBalloonContentLayoutWidth: 260,
            clusterBalloonContentLayoutHeight: 130,
            // Устанавливаем максимальное количество элементов в нижней панели на одной странице
            clusterBalloonPagerSize: 5
        });

        clusterer.options.set({ preset: 'islands#violetIcon' }); 

        yMap.events.add('click', e => {
            let coords = e.get('coords');

            balloonInit(coords, placesMap, yMap, clusterer, geoObjects);
        });

        yMap.geoObjects.add(clusterer);
    }
    catch (e) {
        console.error(e);
    }
})();
