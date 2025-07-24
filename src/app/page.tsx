import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import createPublicSupabaseClient from "@/lib/supabase/client/public-client";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import Link from "next/link";

const Home = async () => {
	const { data: menus, error } = await createPublicSupabaseClient.from("menus").select("*");
	if (error) {
		console.log("error: ", error);
	}
	return (
		<main className="container mx-auto py-8">
			<div className="flex justify-between mb-7">
				<h1 className="text-3xl font-bold">Menu</h1>
				<Link href={"/login"}>
					<Button className="font-bold cursor-pointer" size={"lg"} variant={"default"}>
						Login
					</Button>
				</Link>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				{menus?.map((menu: IMenu) => (
					<Card key={menu.id}>
						<CardContent>
							<Image
								src={menu.image}
								alt={menu.name}
								width={200}
								height={200}
								className="w-full h-[30vh] object-cover rounded-lg"
							/>
							<div className="mt-4 flex justify-between">
								<div>
									<h4 className="font-semibold text-xl">{menu.name}</h4>
									<p>{menu.category}</p>
								</div>
								<p className="font-semibold text-2xl">{menu.price}.00</p>
							</div>
						</CardContent>
						<CardFooter>
							<Link href={`menu/${menu.id}`} className="w-full">
								<Button className="w-full font-bold" size="lg">
									Detail Menu
								</Button>
							</Link>
						</CardFooter>
					</Card>
				))}
			</div>
		</main>
	);
};

export default Home;
