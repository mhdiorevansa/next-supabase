"use client";

import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Supabase from "@/lib/db";
import { IMenu } from "@/types/menu";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const AdminPage = () => {
	const [menus, setMenus] = useState<IMenu[]>([]);
	useEffect(() => {
		const fetchMenus = async () => {
			const { data, error } = await Supabase.from("menus").select("*");
			if (error) {
				console.log("error: ", error);
			} else {
				setMenus(data);
			}
		};
		fetchMenus();
	}, []);
	return (
		<main className="container mx-auto py-8">
			<div className="mb-4 w-full flex justify-between">
				<h1 className="text-3xl font-bold mb-4">Menu</h1>
				<Button className="font-bold">Tambah Menu</Button>
			</div>
			<div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Product</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Price</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{menus.map((menu: IMenu) => (
							<TableRow key={menu.id}>
								<TableCell className="flex gap-3 items-center w-full">
									<Image
										src={menu.image}
										alt={menu.name}
										width={50}
										height={50}
										className="aspect-square object-cover rounded-lg"
									/>
									{menu.name}
								</TableCell>
								<TableCell>{menu.description.split(" ").slice(0, 6).join(" ") + "..."}</TableCell>
								<TableCell>{menu.category}</TableCell>
								<TableCell>{menu.price}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild className="cursor-pointer">
											<Ellipsis />
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-40">
											<DropdownMenuLabel className="font-bold">Action</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuGroup>
												<DropdownMenuItem>Ubah</DropdownMenuItem>
												<DropdownMenuItem className="text-red-400">Hapus</DropdownMenuItem>
											</DropdownMenuGroup>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</main>
	);
};

export default AdminPage;
