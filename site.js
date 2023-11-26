let objectIDs = [];
let currentArtworkIndex = 0;
const maxArtworksToShow = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadArtworkWithImage();
});

function loadArtworkWithImage() {
    if (currentArtworkIndex >= maxArtworksToShow) {
        displayEndMessage();
        return;
    }

    fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects')
    .then(response => response.json())
    .then(data => {
        objectIDs = data.objectIDs;
        tryLoadArtwork();
    });
}

function tryLoadArtwork() {
    if (currentArtworkIndex >= maxArtworksToShow) {
        displayEndMessage();
        return;
    }

    const randomIndex = Math.floor(Math.random() * objectIDs.length);
    const artId = objectIDs[randomIndex];

    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artId}`)
    .then(response => response.json())
    .then(artData => {
        if (artData.primaryImage) {
            document.getElementById('artImage').src = artData.primaryImage;
            let artInfoText = `${artData.title}\n${artData.artistDisplayName}\n${artData.objectDate}`;
            artInfoText += artData.isHighlight ? `\nHighlight` : '';
            artInfoText += artData.department ? `\nDepartment: ${artData.department}` : '';
            artInfoText += artData.culture ? `\nCulture: ${artData.culture}` : '';
            artInfoText += artData.period ? `\nPeriod: ${artData.period}` : '';
            artInfoText += artData.artistWikidata_URL ? `\nArtist Wiki: ${artData.artistWikidata_URL}` : '';
            artInfoText += artData.medium ? `\nMedium: ${artData.medium}` : '';
            artInfoText += artData.country ? `\nCountry: ${artData.country}` : '';

            document.getElementById('artInfo').innerText = artInfoText;
            currentArtworkIndex++;
        } else {
            tryLoadArtwork();
        }
    });

}    

function displayEndMessage() {
    const artContainer = document.getElementById('artContainer');
    artContainer.innerHTML = '<p class="end-message-1">END</p> <br> <p class="end-message-2">No more options for today!</p>';
}


document.getElementById('dislikeButton').addEventListener('click', () => {
    loadArtworkWithImage();
    document.getElementById('artInfo').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
});

document.getElementById('likeButton').addEventListener('click', () => {
    document.getElementById('artInfo').style.display = 'block';
    document.getElementById('nextButton').style.display = 'block';
});

document.getElementById('nextButton').addEventListener('click', () => {
    loadArtworkWithImage();
    document.getElementById('artInfo').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
});



document.getElementById('dislikeButton').addEventListener('click', () => {
    animateAndLoadNextImage('left');
});

document.getElementById('nextButton').addEventListener('click', () => {
    animateAndLoadNextImage('right');
});

function animateAndLoadNextImage(direction) {
    const artImage = document.getElementById('artImage');
    artImage.style.opacity = '0';
    artImage.style.transform = `translateX(${direction === 'left' ? '-' : ''}100%)`;

    setTimeout(() => {
        resetImagePosition();
       
    }, 500); // 500 毫秒后执行，与 CSS 过渡时间相同
}

function resetImagePosition() {
    const artImage = document.getElementById('artImage');
    // 禁用过渡效果
    artImage.style.transition = 'none';

    // 重置图片位置和透明度
    artImage.style.opacity = '0';
    artImage.style.transform = 'translateX(0)';

    // 重新启用过渡效果
    setTimeout(() => {
        artImage.style.transition = '';
        artImage.style.opacity = '1'; // 现在改变透明度，以显示图片
    }, 100); // 使用非常短的延时确保位置变化已经完成
}



