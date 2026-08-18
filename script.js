document.addEventListener("DOMContentLoaded", () => {
    // 1. Alternar Modo Escuro / Claro
    const themeToggleBtn = document.getElementById("toggle-theme");
    const htmlElement = document.documentElement;

    themeToggleBtn.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        if (currentTheme === "light") {
            htmlElement.setAttribute("data-theme", "dark");
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Modo Claro';
        } else {
            htmlElement.setAttribute("data-theme", "light");
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Modo Escuro';
        }
    });

    // 2. Sistema de Áudio da Página (PT e ING)
    const synth = window.speechSynthesis;
    const btnAudioPT = document.getElementById("read-male");
    const btnAudioING = document.getElementById("read-female");
    const btnStopVoice = document.getElementById("stop-voice");

    // Atualiza os textos dos botões na barra de ferramentas
    if (btnAudioPT) {
        btnAudioPT.innerHTML = '<i class="fa-solid fa-volume-high"></i> Áudio PT';
    }
    if (btnAudioING) {
        btnAudioING.innerHTML = '<i class="fa-solid fa-language"></i> Áudio ING';
    }

    let voices = [];

    function loadVoices() {
        voices = synth.getVoices();
    }

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }

    // Dicionário de tradução para o inglês
    function translateToEnglish(text) {
        let translated = text;
        const dictionary = {
            "Acessibilidade Visual: Enxergando Além da Visão": "Visual Accessibility: Seeing Beyond Vision",
            "Compreender as deficiências visuais é o primeiro passo para construir um mundo digital verdadeiramente inclusivo e acessível para todos.": "Understanding visual disabilities is the first step to building a truly inclusive and accessible digital world for everyone.",
            "O que é Deficiência Visual?": "What is Visual Impairment?",
            "A deficiência visual engloba desde a baixa visão (visão subnormal) até a cegueira total. No contexto digital e físico, barreiras invisíveis impedem milhões de pessoas de participarem plenamente da sociedade. A acessibilidade visual busca derrubar essas barreiras através de tecnologias assistivas, design inclusivo e empatia.": "Visual impairment ranges from low vision to total blindness. In the digital and physical context, invisible barriers prevent millions of people from fully participating in society. Visual accessibility seeks to break down these barriers through assistive technologies, inclusive design, and empathy.",
            "Principais Tipos de Deficiência Visual": "Main Types of Visual Impairment",
            "Baixa Visão (Visão Subnormal)": "Low Vision",
            "Condição em que a acuidade visual está comprometida mesmo após correção com óculos ou lentes. Quem possui baixa visão pode se beneficiar imensamente de contrastes fortes e ampliação de tela.": "A condition where visual acuity is compromised even after correction with glasses or lenses. People with low vision can benefit immensely from strong contrasts and screen magnification.",
            "Cegueira Total": "Total Blindness",
            "Ausência completa da percepção visual (incluindo a ausência de percepção de luz). A navegação é feita primariamente por meio de leitores de tela, o Braille e tato.": "Complete absence of visual perception (including the absence of light perception). Navigation is done primarily through screen readers, Braille, and touch.",
            "Daltonismo (Cegueira para Cores)": "Color Blindness",
            "Dificuldade em distinguir certas cores, como vermelho e verde. Embora não seja cegueira total, exige que desenvolvedores não usem cores como única forma de passar informação.": "Difficulty in distinguishing certain colors, such as red and green. Although not total blindness, it requires developers not to use colors as the sole way to convey information.",
            "Visão em Foco. Todos os direitos reservados à inclusão digital.": "Vision in Focus. All rights reserved for digital inclusion."
        };

        for (const [pt, en] of Object.entries(dictionary)) {
            translated = translated.replaceAll(pt, en);
        }
        return translated;
    }

    function speakText(language) {
        if (voices.length === 0) {
            voices = synth.getVoices();
        }

        if (synth.speaking) {
            synth.cancel();
        }

        const mainContentElement = document.getElementById("conteudo-principal");
        let textToSpeak = mainContentElement ? mainContentElement.innerText : "";

        const utterThis = new SpeechSynthesisUtterance();

        if (language === "en") {
            utterThis.text = translateToEnglish(textToSpeak);
            utterThis.lang = "en-US";
            
            const englishVoice = voices.find(v => v.lang.includes("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("US")));
            if (englishVoice) {
                utterThis.voice = englishVoice;
            }
        } else {
            utterThis.text = textToSpeak;
            utterThis.lang = "pt-BR";
            
            const portugueseVoice = voices.find(v => v.lang.includes("pt"));
            if (portugueseVoice) {
                utterThis.voice = portugueseVoice;
            }
        }

        utterThis.onstart = () => {
            btnStopVoice.disabled = false;
            btnAudioPT.disabled = true;
            btnAudioING.disabled = true;
        };

        utterThis.onend = () => {
            resetVoiceButtons();
        };

        utterThis.onerror = () => {
            resetVoiceButtons();
        };

        synth.speak(utterThis);
    }

    function resetVoiceButtons() {
        btnStopVoice.disabled = true;
        btnAudioPT.disabled = false;
        btnAudioING.disabled = false;
    }

    if (btnAudioPT) {
        btnAudioPT.addEventListener("click", () => speakText("pt"));
    }
    
    if (btnAudioING) {
        btnAudioING.addEventListener("click", () => speakText("en"));
    }
    
    if (btnStopVoice) {
        btnStopVoice.addEventListener("click", () => {
            if (synth.speaking) {
                synth.cancel();
                resetVoiceButtons();
            }
        });
    }
});