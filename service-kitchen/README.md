# Nom service

Service de commandes

## à prendre en compte :

- Faire correspondre le hachage pour le jwt secret dans le .env
- Le jwt token doit être inclut dans la requête en bearer token

## Route Api :

```
POST : /orders
```

## Format JSON requête : 

```
{
  "customer_id": 1,
  "products": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

## Fichier migration des tables (non inclut dans le micro service):

### Table products

```
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->text('description')->nullable();
            $table->string('sku')->unique();
            $table->integer('stock_quantity')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
```

### Table orders

```
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Identifiant unique (clé primaire)
            $table->foreignId('customer_id')->constrained('users'); // Référence à la table 'users' pour le client
            $table->decimal('total_amount', 8, 2); // Montant total de la commande
            $table->string('status')->default('en attente de confirmation'); // Statut de la commande
            $table->timestamps(); // Colonnes created_at et updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders'); // Supprimer la table en cas de rollback
    }
}
```

### Table order_product

```
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderProductTable extends Migration
{
    public function up()
    {
        Schema::create('order_product', function (Blueprint $table) {
            $table->id(); // Identifiant unique (clé primaire)
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade'); // Référence à la table 'orders'
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Référence à la table 'products'
            $table->integer('quantity'); // Quantité du produit dans la commande
            $table->timestamps(); // Colonnes created_at et updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_product'); // Supprimer la table en cas de rollback
    }
}
```