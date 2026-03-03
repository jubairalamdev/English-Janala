const pronounceWord = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(res => res.json())
        .then(json => displayLessons(json.data))
}

const loading = (status) => {
        let wordContainer = document.getElementById("word-container");
        let loaderSection = `
            <section class="flex justify-center" id="loading-section">
                <span class="loading loading-dots loading-xl text-primary"></span>
            </section>
        `;
    if (status) {
        wordContainer.innerHTML = "";
        wordContainer.innerHTML = loaderSection;
    }

    else {
        wordContainer.innerHTML = "";
    }
}

const loadLevelWord = (level_no) => {
    // Switch Lessons
    loading(true);
    lessonSwitch(level_no);
    // Get And Send Data
    const url = `https://openapi.programming-hero.com/api/level/${level_no}`
    fetch(url)
        .then(res => res.json())
        .then(data => displayLevelWord(data.data))
    loading(false)
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    if (words.length > 0) {
        wordContainer.classList.replace("grid-cols-1", "md:grid-cols-4")
        words.forEach(word => {
            const card = document.createElement("div");
            card.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center py-5 px-5 space-y-3">
                <h3 class="font-bold text-2xl">${word.word ? word.word : "শব্দ খুজে পাওয়া যায়নি।"}</h3>
                <p class="font-semibold">Meaning of Pronunciation</p>
                <div class="hind-siliguri-font text-2xl font-medium text-neutral-700">"${word.meaning ? word.meaning : "অর্থ খুজে পাওয়া যায়নি।"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ খুজে পাওয়া যায়নি।"}"</div>
                <div class="flex justify-between items-center">
                    <button class="btn" onclick="loadWordDetail(${word.id})"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn" onclick="pronounceWord('${word.word}')"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `;
            wordContainer.appendChild(card);
        });
    }

    else {
        wordContainer.classList.replace("md:grid-cols-4", "grid-cols-1")
        const emptyCard = document.createElement("div");
        emptyCard.innerHTML = `
            <div class="py-16 flex flex-col items-center text-center">
                <img src="./assets/alert-error.png" alt="error-no-word" class="mb-5">
                <p class="text-lg text-gray-600 hind-siliguri-font">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-4xl font-semibold mt-3 hind-siliguri-font">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        wordContainer.appendChild(emptyCard);
    }

}

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
    for (const lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button onclick="loadLevelWord('${lesson.level_no}')" id="lessonBtn-${lesson.level_no}" class="lessonBtns btn btn-outline btn-primary">
                <i class="fa-solid fa-book-open"></i>
                Lesson - ${lesson.level_no}
            </button>
        `;
        levelContainer.appendChild(btnDiv);
    }
}

const lessonSwitch = (level_no) => {
    const allLessonBtn = document.getElementsByClassName("lessonBtns");
    for (const btn of allLessonBtn) {
        btn.classList.add("btn-outline", "btn-primary");
    }
    const lessonBtn = document.getElementById(`lessonBtn-${level_no}`);
    lessonBtn.classList.remove("btn-outline");
}

const loadWordDetail = (wordId) => {
    const url = `https://openapi.programming-hero.com/api/word/${wordId}`;
    fetch(url)
        .then(res => res.json())
        .then(data => showWordDetail(data.data))
}

const showWordDetail = (wordDetail) => {
    const modal = `
        <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box  p-6">
            <div class="p-2 border-2 border-blue-100/50 bg-blue-50/20">
                <h3 class="text-4xl font-bold">${wordDetail.word ? wordDetail.word:"শব্দ খুজে পাওয়া যায়নি।"}</h3>
                <p class="pt-8 pb-3 text-2xl font-semibold">Meaning</p>
                <p class="text-2xl font-medium hind-siliguri-font">${wordDetail.meaning ? wordDetail.meaning:"অর্থ খুঁজে পাওয়া যায়নি।"}</p>
                <p class="pt-8 pb-3 text-2xl font-semibold">Example</p>
                <p class="text-2xl font-medium text-gray-500">${wordDetail.sentence ? wordDetail.sentence:"উদাহরণ বাক্য খুঁজে পাওয়া যায়নি।"}</p>
                <p class="pt-8 pb-3 text-2xl font-semibold">সমার্থক শব্দ গুলো</p>
                <div id="synonyms-box" class="space-x-3">
                    
                </div>
                </div>
                
                <div class="modal-action justify-start">
                    <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn btn-primary">Complete Learning</button>
                    </form>
                </div>


            </div>
        </dialog>
    `;
    let modalContainer = document.getElementById("modal-container");
    modalContainer.innerHTML = "";
    modalContainer.innerHTML = modal;
    let synonymsBox = document.getElementById("synonyms-box");
    synonymsBox.innerHTML = "";
    wordDetail.synonyms.map(synonym => {
        synonymsBox.innerHTML += `<span class="badge px-4 py-4 bg-blue-100/70 border-blue-100 border-2">${synonym}</span>`
    })
    my_modal_5.showModal()
}

loadLessons()

document.getElementById("btn-search").addEventListener("click", () => {
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );

      displayLevelWord(filterWords);
    });
});