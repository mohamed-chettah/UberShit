<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Valider les données de la requête
        $validated = $request->validate([
            'customer_id' => 'required|exists:users,id',
            'products' => 'required|array',
            'products..product_id' => 'required|exists:products,id',
            'products..quantity' => 'required|integer|min:1',
        ]);

        // Calculer le montant total de la commande
        $totalAmount = 0;
        foreach ($validated['products'] as $product) {
            $productData = Product::find($product['product_id']);
            $totalAmount += $productData->price * $product['quantity'];
        }

        // Démarrer une transaction
        DB::beginTransaction();

        try {
            // Insérer la commande dans la table "orders"
            $order = Order::create([
                'customer_id' => $validated['customer_id'],
                'total_amount' => $totalAmount,
            ]);

            // Insérer les produits dans la table pivot "order_product"
            foreach ($validated['products'] as $product) {
                $order->products()->attach($product['product_id'], ['quantity' => $product['quantity']]);
            }

            // Confirmer la transaction
            DB::commit();

            return response()->json(['message' => 'Commande passée avec succès'], 201);
        } catch (\Exception $e) {
            // Si une erreur survient, annuler la transaction
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la commande', 'error' => $e->getMessage()], 500);
        }
    }
}