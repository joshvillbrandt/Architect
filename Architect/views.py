from django.shortcuts import render

# Create your views here.
# For more information on this file, see
# https://docs.djangoproject.com/en/dev/intro/tutorial03/

def home(request):
    return render(request, 'index.html', {})