*** Please use run.py. The wsgi.py relies on nginx which must be installed separately from requirements.txt. ***

# NLP Chatbot Expressed as an Endpoint API
This chatbot is powered by a logsitic regression model trained with natural language processing and machine learning techniques. The underlying framework for the project is Flask as a package rather than as a module. The package structure provides better support for containerization with Docker. Some packges do not work well with projects based around modules. Here wsgi.py acts as an entry point for its namesake, the Web Server Gateway Interface server, which enables the server to interact with the Flask application. Unless you are running nginx with a configuration file locally, please use run.py when testing the application. Unit tests are not particularly optmized for the dataset. While the tests run, two out of three fail. Please move the tests out of the tests folder, and into the same directory as run.py in order to run them with these commands: pytest -v or pytest -v tests/.

# Train_Model.py
In the training module I attempt:

- Logging output to logs/model_training.log
- Load my dataset from data/faq_dataset.csv
- Extract the features (questions) and lables (intents)
- Split the dataset into 80/20 for training and testing
- Use TF-IDF for vectorizing the text (removs stop words; takes unigrams and bigrams into account)
- Use a logistic regression model; set max_iter=200 and class_weight='balanced'
- Use cross-validation (StratifiedKFold) with 3 splits (splits must be less than or equal the number of intents/classes)
- Test set (precision, recall, f-1 score)
- Save the model and vectorizer

# Chatbot_Logic.py
In the chatbot module I attempt:

- Set up a custom logger for chatbot logic
- Send a set of logs to logs/intent_logs.log for sucessful or unsuccessful intent tracking
- Load the dataset and model(s)
- Extract the questions, answers, and intents
- Load the intent prediction model and vectorizer for FAQ questions
- Get the user query and get the chatbot response
- Log the user query and predicted intent
- Check validity of predicted intent
- Vectorize the user query for matching
- Log the details
- Return an (hopefully) appropriate response based on the dataset

# Routes.py
The routes module contains all of the routes for the project including the chatbot API. It contains some additional functionality like limitations on the number of characters a user can input. There is also some more logging, and information collection of the interactions with the chatbot.

# Other
Javascript and CSS were utilized to provide a more easy to use front end. Things like a dynamic character count, and using Javascript to update the HTML elements to display messages, and overall to just make things more dynamic. I used templating for the HTML pages (Jinja2).
  
