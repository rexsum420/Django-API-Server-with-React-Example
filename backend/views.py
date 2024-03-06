from django.shortcuts import render, HttpResponse
from django.views.generic import View
from django.conf import settings
import os

class ReactAppView(View):
    def get(self, request):
        # Load the React app's main HTML file
        with open(os.path.join(settings.REACT_APP_DIR, 'index.html')) as file:
            return HttpResponse(file.read())
