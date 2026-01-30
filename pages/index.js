import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ShoppingCart, Search, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import prisma from '@/lib/prisma';

export async function getServerSideProps(context) {
  const { query } = context;
  const page = parseInt(query.page || '1', 10);
  const searchQuery = query.q || '';
  const itemsPerPage = 8;

  try {
    const where = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { description: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }
      : {};

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        currentPage: page,
        totalPages,
        searchQuery,
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        currentPage: 1,
        totalPages: 1,
        searchQuery: '',
      },
    };
  }
}

export default function Home({ products, currentPage, totalPages, searchQuery }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [search, setSearch] = useState(searchQuery || '');
  const [isAdding, setIsAdding] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('q', search);
    } else {
      params.delete('q');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const handleAddToCart = async (productId) => {
    if (!session) {
      toast.error('Please sign in to add items to cart');
      router.push('/api/auth/signin');
      return;
    }

    setIsAdding({ ...isAdding, [productId]: true });

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      toast.error('Error adding to cart');
    } finally {
      setIsAdding({ ...isAdding, [productId]: false });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              ShopStack
            </Link>
            
            <div className="flex items-center gap-4">
              {status === 'loading' ? (
                <div>Loading...</div>
              ) : session ? (
                <>
                  <Link href="/cart">
                    <Button variant="outline" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{session.user?.name}</span>
                  </div>
                  <Link href="/api/auth/signout">
                    <Button variant="ghost" size="sm" data-testid="signout-button">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/api/auth/signin">
                  <Button size="sm" data-testid="signin-button">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="search-input"
              className="flex-1"
            />
            <Button type="submit" data-testid="search-button">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <Card key={product.id} data-testid={`product-card-${product.id}`} className="overflow-hidden">
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:underline">{product.name}</h3>
                </Link>
                <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  disabled={isAdding[product.id]}
                  data-testid={`add-to-cart-button-${product.id}`}
                  className="w-full"
                >
                  {isAdding[product.id] ? 'Adding...' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4">
            {currentPage > 1 && (
              <Link
                href={`/?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: currentPage - 1 }).toString()}`}
              >
                <Button variant="outline" data-testid="pagination-prev">
                  Previous
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            {currentPage < totalPages && (
              <Link
                href={`/?${new URLSearchParams({ ...Object.fromEntries(searchParams), page: currentPage + 1 }).toString()}`}
              >
                <Button variant="outline" data-testid="pagination-next">
                  Next
                </Button>
              </Link>
            )}
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        )}
      </main>
    </div>
  );
}