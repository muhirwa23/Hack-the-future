const darkModeToggle = document.getElementById('dark-mode-toggle');
        const body = document.body;
        const surveyForm = document.getElementById('survey-form');
        const aiSubmit = document.getElementById('ai-submit');
        const feedbackForm = document.getElementById('feedback-form');
        const voiceInputBtn = document.getElementById('voice-input');
        const aiQueryInput = document.getElementById('ai-query');

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
        });
// uzafata api yawe yo kuri backend muri python uyi consome hano ugende ugisimbuza 
        surveyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const predictionResults = document.getElementById('prediction-results');
            predictionResults.innerHTML = "<p>Based on your input, you may be experiencing mild anxiety. We recommend practicing mindfulness techniques and considering a consultation with a mental health professional.</p>";
        });

        aiSubmit.addEventListener('click', () => {
            const query = aiQueryInput.value;
            const aiResponse = document.getElementById('ai-response');
            // hano uza returninga data zawe from your backend bitewe na query wa searchinze and then uza conqatinatinga query yumu user
            aiResponse.innerHTML = `<p>Based on your question about "${query}", here's a general insight: Regular exercise and maintaining a consistent sleep schedule can significantly improve mental well-being. However, for personalized advice, please consult with a mental health professional.</p>`;
        });

        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your feedback!');
        });

        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            voiceInputBtn.addEventListener('click', () => {
                recognition.start();
            });

            recognition.onresult = (event) => {
                aiQueryInput.value = event.results[0][0].transcript;
            };

            recognition.onerror = (event) => {
                alert('Voice recognition error: ' + event.error);
            };
        } else {
            voiceInputBtn.disabled = true;
            voiceInputBtn.title = "Voice recognition not supported";
        }

        const trace1 = {
            x: ['Depression', 'Anxiety', 'Stress'],
            y: [20, 14, 23],
            type: 'bar',
            name: 'Urban'
        };

        const trace2 = {
            x: ['Depression', 'Anxiety', 'Stress'],
            y: [12, 18, 29],
            type: 'bar',
            name: 'Rural'
        };

        const data = [trace1, trace2];

        const layout = {
            barmode: 'group',
            title: 'Mental Health Conditions: Urban vs Rural',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                color: '#333333'
            
            }
        
        };

        Plotly.newPlot('data-visualization', data, layout);

        darkModeToggle.addEventListener('click', () => {
            const updateLayout = {
                font: {
                    color: body.classList.contains('dark-mode') ? '#e0e0e0' : '#333333'
                }
            };
            Plotly.relayout('data-visualization', updateLayout);
        });