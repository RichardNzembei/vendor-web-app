import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import Products from "@/views/Products.vue";
const router=createRouter({
    history:createWebHistory(import.meta.env.BASE_URL),
    routes:[
{
    name:'/homepage',
    path:'/',
    component:HomePage
},
{
    name:'/products',
    path:'/products',
    component:Products
}
    ]
})

export default router