import CustomerModel from "@/db/models/customerModel";

export async function GET(request: Request) {
  try {
    const id = request.headers.get("x-user-id") as string;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "User ID is required in headers" }),
        { status: 400 }
      );
    }

    const customer = await CustomerModel.findById(id);
    if (!customer) {
      return new Response(
        JSON.stringify({ error: "Customer not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (error: any) {
    console.error("Error fetching customer:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const id = request.headers.get("x-user-id") as string;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "User ID is required in headers" }),
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.name || !body.email || !body.phone || !body.address) {
      return new Response(
        JSON.stringify({
          error: "All fields (name, email, phone, address) are required",
        }),
        { status: 400 }
      );
    }

    const updateCustomer = await CustomerModel.updateProfile(id, body);

    if (!updateCustomer) {
      return new Response(
        JSON.stringify({ error: "Customer not found or update failed" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updateCustomer), { status: 200 });
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
