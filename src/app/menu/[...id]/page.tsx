"use client";

import { Button } from "@/components/ui/button";
import SupabaseBrowserClient from "@/lib/supabase/client";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const DetailMenu = () => {
	const { id } = useParams();
	const [detailMenu, setDetailMenu] = useState<IMenu | null>(null);
	useEffect(() => {
		const fetchDetailMenu = async () => {
			const { data, error } = await SupabaseBrowserClient.from("menus")
				.select("*")
				.eq("id", id)
				.single();
			if (error) {
				console.log("error: ", error);
			} else {
				setDetailMenu(data);
			}
		};
		fetchDetailMenu();
	}, [id]);
	return (
		<main className="container mx-auto py-8">
			<div className="flex gap-16">
				{detailMenu && (
					<div className="flex gap-16 items-center w-full">
						<div className="w-1/2">
							<Image
								src={detailMenu.image}
								alt={detailMenu.name}
								width={900}
								height={900}
								className="w-full h-[70vh] object-cover rounded-2xl"
							/>
						</div>
						<div className="w-1/2">
							<h1 className="text-5xl font-bold mb-4 capitalize">{detailMenu.name}</h1>
							<p className="text-xl mb-4 text-neutral-500">{detailMenu.description}</p>
							<div className="flex gap-4 items-center">
								<p className="text-4xl font-bold">Rp.{detailMenu.price}</p>
								<Button className="text-lg py-6 font-bold" size="lg">
									Beli Sekarang
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
};

export default DetailMenu;
