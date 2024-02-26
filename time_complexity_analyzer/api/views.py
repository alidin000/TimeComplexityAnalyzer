from django.http import HttpResponse

# Create your views here.
def main(request):
    return HttpResponse( "Hello, world. You're at the time_complexity_analyzer index.")