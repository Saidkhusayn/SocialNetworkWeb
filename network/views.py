from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.paginator import Paginator

from .models import *


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
    
@csrf_exempt
def posts(request):
    if request.method == "POST":
        data = json.loads(request.body)
        content = data.get('content', '')

        if content:
            post = Post(user=request.user, content=content)
            post.save()
            return JsonResponse({"message": "Post created successfully"}, status=201)
        else:
            return JsonResponse({"error": "Content cannot be empty"}, status=400)
    else:
        return JsonResponse({"error": "POST request required"}, status=400)
    
def allposts(request):
    posts = Post.objects.all().order_by('-timestap')
    paginator = Paginator(posts, 10)  # Show 10 posts per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/allposts.html", {
        'posts': posts,
        'page_obj': page_obj,
    })

@csrf_exempt
def profile(request, username):
    user = get_object_or_404(User, username=username)
    if request.user.is_authenticated:   
        if request.method == 'PUT':
            if request.user != user:
                if request.user.following.filter(pk=user.pk).exists():
                    request.user.following.remove(user)
                else:
                    request.user.following.add(user)

                return JsonResponse({
                    'isFollowing': request.user.following.filter(pk=user.pk).exists(),
                    'follower_count': user.follower_count(),
                    'following_count': request.user.following_count()
                })

    follower_count = user.follower_count() 
    following_count = user.following_count() 
    posts = Post.objects.filter(user=user).order_by('-timestap')
    paginator = Paginator(posts, 10)  # Show 10 posts per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number) 
    return render(request, 'network/profile.html', {
        'posts': posts,
        'postUser': user,
        'follower_count': follower_count,
        'following_count': following_count,
        'page_obj': page_obj,
    })

def following(request):
    following_users = request.user.following.all()
    posts = Post.objects.filter(user__in=following_users).order_by('-timestap')
    paginator = Paginator(posts, 10)  # Show 10 posts per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Pass the posts to the template
    return render(request, 'network/following.html', {
        'posts': posts, 
        'page_obj': page_obj,
    })

@login_required
@csrf_exempt
def edit(request, post_id):
    try:
        post = Post.objects.get(user=request.user, pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'error': 'Post not found!'}, status=404)

    if request.method == 'PUT':
        if request.user == post.user:
            try:
                data = json.loads(request.body)
                content = data.get('content')
                if content:
                    post.content = content
                    print(f"Received content: {content}")
                    post.save()
                    return HttpResponse(status=204)
                else:
                    return JsonResponse({'error': 'Content is missing'}, status=400)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
        else:
            return HttpResponseForbidden("You are not allowed to edit this post.")
    else:
        return JsonResponse({'error': 'PUT request required.'}, status=400)
    
@login_required
@csrf_exempt
def like(request, post_id):
    if request.method == 'PUT':
        if request.user.is_authenticated:
           try:
            post = Post.objects.get(id=post_id)
            likes_count = post.total_likes()
            if post.likes.filter(id=request.user.id).exists():
                post.likes.remove(request.user)
            else:
                post.likes.add(request.user)
            return JsonResponse({
            'isLiked': post.likes.filter(pk=request.user.pk).exists(),
            'likes_count': likes_count,
        })
           except json.JSONDecodeError:
               return JsonResponse({'error': 'Invalid JSON'}, status=400)
        else:
            return redirect('login')
    return JsonResponse({'error': 'PUT required!'}, status=403)
                
