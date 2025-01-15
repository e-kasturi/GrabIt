import BalanceModel from "@/db/models/balanceModel"
import CustomerModel from "@/db/models/customerModel"
import OutletModel from "@/db/models/outletModel"
import errorHandler from "@/helpers/errorHandler"

export async function POST(request: Request) {
    try{
        const form = await request.json()

        if(form.role === "customer"){
            const newCustomer = {
                name: form.name,
                email: form.email,
                password: form.password,
                address: form.address,
                role: form.role,
                phone: form.phone,
                imgUrl: form.imgUrl,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude)
            }
            await CustomerModel.create(newCustomer)
        } else {
            const newOutlet = {
                name: form.name,
                email: form.email,
                password: form.password,
                address: form.address,
                role: form.role,
                nameOutlet: form.nameOutlet,
                phone: form.phone,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude)
            }
            const outlet = await OutletModel.create(form)
            await BalanceModel.create(outlet.insertedId)
        }

        return Response.json({
            message: "Create successfully",
        })
    } catch (error) {
        return errorHandler(error)
    }

}