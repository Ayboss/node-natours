import axios from 'axios';

const stripe = Stripe('pk_test_51HQ7lpDwoBi0H5WUiGiUiMAVJgev2qxI1PdIC51eOyjreBb6OaKrPqZln4fTtWdG06q4VKSpRVldF4bvRDpu66W100g337g3on'); 

export const bookTour = async (tourId)=>{
    try{
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        await stripe.redirectToCheckout({sessionId: session.data.session.id});
    }catch(err){
        console.log(err)
    }
    
}