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
import { FormEvent, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import createBrowserSupabaseClient from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const AdminPage = () => {
	const router = useRouter();
	const [menus, setMenus] = useState<IMenu[]>([]);
	const [user, setUser] = useState<User | null>(null);
	const [createDialog, setCreateDialog] = useState(false);
	const [logoutDialog, setLogoutDialog] = useState(false);
	const [selectedMenu, setSelectedMenu] = useState<{
		menu: IMenu;
		action: "ubah" | "hapus";
	} | null>(null);

	useEffect(() => {
		const fetchMenus = async () => {
			const { data, error } = await createBrowserSupabaseClient.from("menus").select("*");
			if (error) {
				console.log("error: ", error);
			} else {
				setMenus(data);
			}
		};
		fetchMenus();
	}, []);

	useEffect(() => {
		const fetchUserAuth = async () => {
			const {
				data: { user },
				error,
			} = await createBrowserSupabaseClient.auth.getUser();
			if (error) {
				console.log("error: ", error);
			} else {
				setUser(user);
			}
		};
		fetchUserAuth();
	}, []);

	const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		try {
			const { data, error } = await createBrowserSupabaseClient.from("menus")
				.insert(Object.fromEntries(formData))
				.select("*");
			if (error) {
				console.log("error: ", error);
				toast.error("Gagal menambah menu: " + error.message);
				return;
			} else {
				setMenus((prev) => [...prev, ...data]);
				toast.success("Menu berhasil ditambahkan");
				setCreateDialog(false);
			}
		} catch (error) {
			console.log("error: ", error);
			toast.error("Terjadi kesalahan tak terduga.");
		}
	};

	const handleDeleteMenu = async () => {
		try {
			const { error } = await createBrowserSupabaseClient.from("menus")
				.delete()
				.eq("id", selectedMenu?.menu.id);
			if (error) {
				console.log("error: ", error);
				toast.error("Gagal menghapus menu: " + error.message);
				return;
			} else {
				setMenus((prev) => prev.filter((menu) => menu.id !== selectedMenu?.menu.id));
				toast.success("Menu berhasil dihapus");
				setSelectedMenu(null);
			}
		} catch (error) {
			console.log("error: ", error);
			toast.error("Terjadi kesalahan tak terduga.");
		}
	};

	const handleUpdateMenu = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		try {
			const { error } = await createBrowserSupabaseClient.from("menus")
				.update(Object.fromEntries(formData))
				.eq("id", selectedMenu?.menu.id);
			if (error) {
				console.log("error: ", error);
				toast.error("Gagal mengubah menu: " + error.message);
				return;
			} else {
				setMenus((prev) =>
					prev.map((menu) =>
						menu.id == selectedMenu?.menu.id ? { ...menu, ...Object.fromEntries(formData) } : menu
					)
				);
				toast.success("Menu berhasil diubah");
				setSelectedMenu(null);
			}
		} catch (error) {
			console.log("error: ", error);
			toast.error("Terjadi kesalahan tak terduga.");
		}
	};

	const handleLogout = async () => {
		const { error } = await createBrowserSupabaseClient.auth.signOut();
		if (error) {
			console.log("error: ", error);
			toast.error("Sepertinya ada kesalahan");
		} else {
			toast.success("Berhasil logout");
			router.push("/");
			setLogoutDialog(false);
		}
	};

	return (
		<main className="container mx-auto py-8">
			<div className="mb-4 w-full flex justify-between">
				<div className="space-y-4">
					<h1 className="text-3xl font-bold mb-4">Hallo {user?.email}</h1>
					{/* modal add */}
					<Dialog open={createDialog} onOpenChange={setCreateDialog}>
						<DialogTrigger asChild>
							<Button className="font-bold cursor-pointer">Tambah Menu</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
							<form onSubmit={handleAddMenu} className="space-y-4">
								<DialogHeader>
									<DialogTitle>Tambah Menu</DialogTitle>
									<DialogDescription>Membuat menu baru dengan input data</DialogDescription>
								</DialogHeader>
								<div className="grid w-full gap-4">
									<div className="grid w-full gap-3">
										<Label htmlFor="nama">Nama Menu</Label>
										<Input id="nama" name="name" placeholder="Masukkan Nama Menu" required />
									</div>
									<div className="grid w-full gap-3">
										<Label htmlFor="harga">Harga Menu</Label>
										<Input id="harga" name="price" placeholder="Masukkan Harga Menu" required />
									</div>
									<div className="grid w-full gap-3">
										<Label htmlFor="gambar">Gambar Menu</Label>
										<Input
											id="gambar"
											name="image"
											placeholder="Masukkan URL Gambar Menu"
											required
										/>
									</div>
									<div className="grid w-full gap-3">
										<Label htmlFor="kategori">Kategori Menu</Label>
										<Select required name="category">
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Pilih Kategori" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>Kategori Menu</SelectLabel>
													<SelectItem value="makanan">Makanan</SelectItem>
													<SelectItem value="minuman">Minuman</SelectItem>
												</SelectGroup>
											</SelectContent>
										</Select>
									</div>
									<div className="grid w-full gap-3">
										<Label htmlFor="deskripsi">Deskripsi Menu</Label>
										<Textarea
											id="deskripsi"
											name="description"
											required
											placeholder="Masukkan Deskripsi Menu"
											className="resize-none h-28"
										/>
									</div>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button type="button" variant={"secondary"} className="cursor-pointer">
											Batal
										</Button>
									</DialogClose>
									<Button type="submit" className="cursor-pointer">
										Tambah
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
				{/* modal logout */}
				<Dialog open={logoutDialog} onOpenChange={setLogoutDialog}>
					<DialogTrigger asChild>
						<Button className="font-bold cursor-pointer" variant={"destructive"}>
							Logout
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
						<DialogHeader>
							<DialogTitle>Logout</DialogTitle>
							<DialogDescription>Kamu yakin ingin logout?</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant={"secondary"} className="cursor-pointer">
									Batal
								</Button>
							</DialogClose>
							<Button onClick={handleLogout} variant={"destructive"} className="cursor-pointer">
								Logout
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
			{/* data table */}
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
												<DropdownMenuItem onClick={() => setSelectedMenu({ menu, action: "ubah" })}>
													Ubah
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-400"
													onClick={() => setSelectedMenu({ menu, action: "hapus" })}>
													Hapus
												</DropdownMenuItem>
											</DropdownMenuGroup>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{/* modal delete */}
			<Dialog
				open={selectedMenu !== null && selectedMenu.action === "hapus"}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedMenu(null);
					}
				}}>
				<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
					<DialogHeader>
						<DialogTitle>Hapus Menu</DialogTitle>
						<DialogDescription>
							Kamu yakin mau hapus menu {selectedMenu?.menu.name}?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant={"secondary"} className="cursor-pointer">
								Batal
							</Button>
						</DialogClose>
						<Button onClick={handleDeleteMenu} variant={"destructive"} className="cursor-pointer">
							Hapus
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{/* modal update */}
			<Dialog
				open={selectedMenu !== null && selectedMenu.action === "ubah"}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedMenu(null);
					}
				}}>
				<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto no-scrollbar">
					<form onSubmit={handleUpdateMenu} className="space-y-4">
						<DialogHeader>
							<DialogTitle>Ubah Menu</DialogTitle>
							<DialogDescription>
								Form ini digunakan untuk mengubah menu yang dipilih.
							</DialogDescription>
						</DialogHeader>
						<div className="grid w-full gap-4">
							<div className="grid w-full gap-3">
								<Label htmlFor="nama">Ubah Menu</Label>
								<Input
									id="nama"
									name="name"
									placeholder="Masukkan Nama Menu"
									required
									defaultValue={selectedMenu?.menu.name}
								/>
							</div>
							<div className="grid w-full gap-3">
								<Label htmlFor="harga">Harga Menu</Label>
								<Input
									id="harga"
									name="price"
									placeholder="Masukkan Harga Menu"
									required
									defaultValue={selectedMenu?.menu.price}
								/>
							</div>
							<div className="grid w-full gap-3">
								<Label htmlFor="gambar">Gambar Menu</Label>
								<Input
									id="gambar"
									name="image"
									placeholder="Masukkan URL Gambar Menu"
									required
									defaultValue={selectedMenu?.menu.image}
								/>
							</div>
							<div className="grid w-full gap-3">
								<Label htmlFor="kategori">Kategori Menu</Label>
								<Select required name="category" defaultValue={selectedMenu?.menu.category}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Pilih Kategori" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Kategori Menu</SelectLabel>
											<SelectItem value="food">Makanan</SelectItem>
											<SelectItem value="drink">Minuman</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
							<div className="grid w-full gap-3">
								<Label htmlFor="deskripsi">Deskripsi Menu</Label>
								<Textarea
									id="deskripsi"
									name="description"
									required
									placeholder="Masukkan Deskripsi Menu"
									className="resize-none h-28"
									defaultValue={selectedMenu?.menu.description}
								/>
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant={"secondary"} className="cursor-pointer">
									Batal
								</Button>
							</DialogClose>
							<Button type="submit" className="cursor-pointer">
								Ubah
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default AdminPage;
