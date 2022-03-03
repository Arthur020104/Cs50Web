from django.contrib import admin


from .models import User, Category, Product
# Register your models here.
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "time_created", "current_bid", "bids_count", "status")


admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(User)