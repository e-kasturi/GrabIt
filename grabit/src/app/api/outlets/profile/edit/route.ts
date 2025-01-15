import { database } from "@/db/config/config"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
    const profileData = await request.json()
    const { email, name, address, phone, nameOutlet, password, latitude, longitude} = profileData

    const outlet = await database.collection("outlets").findOne({ email })

    if(!outlet) {
        return NextResponse.json(
            { message: "Outlet with the given email not found"},
            {status: 404}
        )
    }

    const updateResult = await database.collection("outlets").updateOne(
        {email},
        {
            $set: {
                name, 
                address,
                nameOutlet,
                password,
                phone,
                latitude,
                longitude,
            }
        }
    )

    if(updateResult.modifiedCount === 0){
        return NextResponse.json(
            { message: "Failed to update profile."},
            { status: 400}
        )
    }

    return NextResponse.json(
        { message: "Outlet profile update successfully."},
        { status: 200}
    )
}